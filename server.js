const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Performance
app.use(helmet());
app.use(compression());

// CORS specifically for aiworkflowadvisors.com
app.use(cors({
    origin: [
        'https://aiworkflowadvisors.com',
        'https://*.aiworkflowadvisors.com',
        'https://*.netlify.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        status: '🎤 Voice Agent Brain Server Running',
        website: 'aiworkflowadvisors.com',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            chat: '/api/proxy/chat',
            voice: '/api/proxy/voice',
            health: '/health'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// Proxy endpoints (matching your website's expectations)
app.post('/api/proxy/chat', (req, res) => {
    try {
        const { message, userId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        // Enhanced AI responses
        let response;
        const msg = message.toLowerCase();
        
        if (msg.includes('n8n') || msg.includes('workflow')) {
            response = `I can help you with n8n workflows! You mentioned: "${message}". I can analyze workflow security, optimize efficiency, and suggest improvements. What specific aspect would you like to explore?`;
        } else if (msg.includes('hello') || msg.includes('hi')) {
            response = `Hello! I'm your AI workflow advisor. You said: "${message}". I'm here to help you optimize your n8n workflows and improve automation processes!`;
        } else if (msg.includes('help')) {
            response = `I'm here to help! You asked: "${message}". I can assist with workflow analysis, security audits, performance optimization, and n8n best practices.`;
        } else {
            const responses = [
                `Interesting point about: "${message}". In workflow automation, this relates to optimizing data flow and reducing bottlenecks.`,
                `Thank you for sharing: "${message}". Let me analyze this from a workflow efficiency perspective.`,
                `You mentioned: "${message}". This is important for workflow design - would you like me to elaborate on optimization strategies?`
            ];
            response = responses[Math.floor(Math.random() * responses.length)];
        }
        
        res.json({
            response: response,
            timestamp: new Date().toISOString(),
            userId: userId || 'anonymous',
            status: 'success'
        });
        
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Chat processing failed' });
    }
});

// Voice processing endpoint
app.post('/api/proxy/voice', (req, res) => {
    try {
        const { text, voiceId } = req.body;
        
        const processedText = text || 'Hello! I am your AI workflow advisor, ready to help optimize your n8n automations!';
        
        res.json({
            message: 'Voice processing complete',
            text: processedText,
            voiceId: voiceId || 'default',
            audioUrl: null, // Would contain TTS audio in production
            timestamp: new Date().toISOString(),
            status: 'success'
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Voice processing failed' });
    }
});

// Authentication endpoint (required by your website)
app.post('/api/auth/configure', (req, res) => {
    res.json({
        message: 'Configuration received',
        sessionToken: 'demo-session-' + Date.now(),
        csrfToken: 'csrf-' + Date.now(),
        expires: Date.now() + 3600000,
        status: 'success'
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🎤 Voice Agent Brain Server Started!`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📱 Ready for: aiworkflowadvisors.com`);
    console.log(`🕒 Started: ${new Date().toISOString()}`);
    console.log(`\n🚀 Your voice agent is ready to work!\n`);
});
