const { GoogleGenerativeAI } = require('@google/generative-ai');
const Order = require('../models/Order');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Build a rich context string from the user's orders.
 * This is passed to Gemini so it can reason about real data.
 */
async function buildOrderContext(userId) {
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(200).lean();

  if (!orders.length) {
    return { context: null, stats: null };
  }

  // Aggregate stats
  const totalRevenue = orders.reduce((s, o) => s + o.price * o.quantity, 0);
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const deliveredRevenue = deliveredOrders.reduce((s, o) => s + o.price * o.quantity, 0);

  // Top products
  const productMap = orders.reduce((acc, o) => {
    acc[o.product] = (acc[o.product] || 0) + o.quantity;
    return acc;
  }, {});
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => `${name} (${qty} units)`);

  // Recent orders (last 20) as plain text
  const recentOrderLines = orders.slice(0, 20).map((o) =>
    `• ${o.orderNumber}: ${o.customerName} | ${o.product} x${o.quantity} @ PKR ${o.price} | Status: ${o.status} | City: ${o.city || 'N/A'} | Date: ${new Date(o.createdAt).toLocaleDateString('en-PK')}`
  ).join('\n');

  const stats = {
    total: orders.length,
    totalRevenue,
    deliveredRevenue,
    statusCounts,
    topProducts,
    completionRate: deliveredOrders.length / orders.length,
  };

  const context = `
BUSINESS ORDER DATA (${orders.length} total orders):

=== SUMMARY STATS ===
- Total Orders: ${orders.length}
- Total Revenue (all orders): PKR ${totalRevenue.toLocaleString()}
- Collected Revenue (Delivered only): PKR ${deliveredRevenue.toLocaleString()}
- Completion Rate: ${Math.round(stats.completionRate * 100)}%

=== STATUS BREAKDOWN ===
${Object.entries(statusCounts).map(([s, c]) => `- ${s}: ${c}`).join('\n')}

=== TOP SELLING PRODUCTS ===
${topProducts.join(', ')}

=== RECENT 20 ORDERS ===
${recentOrderLines}
`.trim();

  return { context, stats };
}

/**
 * POST /api/ai/summary
 * Generates a comprehensive AI business summary.
 */
exports.generateSummary = async (req, res, next) => {
  try {
    const { context, stats } = await buildOrderContext(req.user.id);

    if (!context) {
      return successResponse(res, 200, {
        insight: "You don't have any orders yet. Once you start adding orders, I'll be able to generate business insights for you!",
        stats: null,
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a smart business analyst assistant for a Pakistani WhatsApp/Instagram seller. 
Analyze the following order data and provide a comprehensive, actionable business summary.

${context}

Write a detailed but friendly summary covering:
1. 📊 Overall business performance
2. 💰 Revenue analysis (total vs collected)
3. 🏆 Best performing products
4. ⚠️ Areas of concern (e.g. high cancellations, pending orders)
5. 💡 3 specific actionable recommendations to grow the business

Keep the tone professional but conversational. Use PKR for currency. Format with clear sections.`;

    const result = await model.generateContent(prompt);
    const insight = result.response.text();

    logger.info(`AI summary generated for user ${req.user.id}`);
    return successResponse(res, 200, { insight, stats });
  } catch (err) {
    logger.error(`AI summary error: ${err.message}`);
    next(err);
  }
};

/**
 * POST /api/ai/ask
 * Answers a specific question about the user's orders.
 */
exports.askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length < 3) {
      return errorResponse(res, 400, 'Please provide a valid question');
    }

    if (question.trim().length > 500) {
      return errorResponse(res, 400, 'Question too long (max 500 characters)');
    }

    const { context } = await buildOrderContext(req.user.id);

    if (!context) {
      return successResponse(res, 200, {
        answer: "You don't have any orders yet, so I can't answer questions about your data. Start adding orders and come back!",
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a smart business analyst assistant for a Pakistani WhatsApp/Instagram seller.
Answer the following question based ONLY on the order data provided. Be concise and specific.

${context}

User Question: ${question}

Instructions:
- Use PKR for currency values
- Be direct and specific with numbers from the data
- If the question can't be answered from the data, say so politely
- Keep your answer focused and under 200 words`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    logger.info(`AI Q&A answered for user ${req.user.id}: "${question.substring(0, 50)}"`);
    return successResponse(res, 200, { answer, question });
  } catch (err) {
    logger.error(`AI Q&A error: ${err.message}`);
    next(err);
  }
};
