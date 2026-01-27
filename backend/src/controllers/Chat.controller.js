const prisma = require('../lib/prisma');
const { getIO } = require('../lib/socket');
const fs = require('fs');
const path = require('path');

// Use Artifact Directory for guaranteed access
const DEBUG_LOG_PATH = 'C:/Users/asus/.gemini/antigravity/brain/3e4b1eee-c599-4e39-8db8-c1189d4781a8/backend_debug.log';

const logToFile = (msg) => {
    try {
        const timestamp = new Date().toISOString();
        fs.appendFileSync(DEBUG_LOG_PATH, `[${timestamp}] [CHAT] ${msg}\n`);
    } catch(e) {
        // Fallback to console if file write fails
        console.error('LOG_TO_FILE_FAILED', e);
    }
};

class ChatController {
  static async listConversations(req, res) {
    try {
      logToFile('listConversations called');
      const { id } = req.user;
      
// ... (rest of listConversations)

      // Find conversations where user is participant or directParticipant
      const conversations = await prisma.conversation.findMany({
        where: {
          OR: [
            { participantId: id },
            { directParticipantId: id }
          ]
        },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: { sender: { select: { name: true } } }
          },
          participant: { select: { id: true, name: true, profileImg: true, role: true, phone: true } },
          directParticipant: { select: { id: true, name: true, profileImg: true, role: true, phone: true } }
        },
        orderBy: { updatedAt: 'desc' }
      });
      
      // Format for frontend
      const formatted = conversations.map(c => {
        const otherUser = c.participantId === id ? c.directParticipant : c.participant;
        return {
          id: c.id,
          otherUser,
          lastMessage: c.messages[0],
          updatedAt: c.updatedAt
        };
      });

      res.json(formatted);
    } catch (error) {
      console.error('List Conversations Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getMessages(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const conversationId = parseInt(id);

      const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { participantId: true, directParticipantId: true }
      });
      if (!conv) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      const isParticipant = conv.participantId === userId || conv.directParticipantId === userId;
      if (!isParticipant) {
        return res.status(403).json({ error: 'You do not have access to this conversation' });
      }

      const messages = await prisma.chatMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true, role: true, profileImg: true } } }
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async sendMessage(req, res) {
    try {
      const { conversationId, content, attachments } = req.body;
      const { id: senderId, societyId } = req.user;
      const cid = parseInt(conversationId);

      const conv = await prisma.conversation.findUnique({
        where: { id: cid },
        select: { participantId: true, directParticipantId: true }
      });
      if (!conv) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      const isParticipant = conv.participantId === senderId || conv.directParticipantId === senderId;
      if (!isParticipant) {
        return res.status(403).json({ error: 'You cannot send messages in this conversation' });
      }

      const message = await prisma.chatMessage.create({
        data: {
          conversationId: cid,
          senderId,
          content,
          attachments: attachments || [],
        },
        include: { 
          sender: { select: { id: true, name: true, role: true, profileImg: true } },
          conversation: true
        }
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: cid },
        data: { updatedAt: new Date() }
      });

      // Emit via socket
      const io = getIO();
      io.to(`conversation_${cid}`).emit('new-message', message);
      
      // Notify society room for global updates
      if (societyId) {
        io.to(`society_${societyId}`).emit('conversation-updated', {
            conversationId: cid,
            lastMessage: content,
            senderName: message.sender.name
        });
      }

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async startConversation(req, res) {
    try {
      logToFile(`Start Conversation Request. Body: ${JSON.stringify(req.body)}`);
      // Expecting targetUserId in body
      const { targetUserId } = req.body; 
      const { id: myId, societyId } = req.user;
      logToFile(`User: ${JSON.stringify(req.user)}`);

      if (!targetUserId) {
          return res.status(400).json({ error: 'Target user ID is required' });
      }

      logToFile('Checking existing conversation...');
      const tid = parseInt(targetUserId, 10);
      const uidA = Math.min(myId, tid);
      const uidB = Math.max(myId, tid);
      // Check if conversation already exists (normalize pair as participantId ≤ directParticipantId)
      let conversation = await prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          participantId: uidA,
          directParticipantId: uidB
        }
      });

      if (!conversation) {
        console.log('No existing conversation found. Creating new one...');
        // If I don't have a societyId (e.g. Super Admin), try to use the target user's societyId
        let finalSocietyId = societyId;
        if (!finalSocietyId) {
            console.log('No societyId for current user. Fetching target user societyId...');
            const targetUser = await prisma.user.findUnique({
                where: { id: parseInt(targetUserId) },
                select: { societyId: true }
            });
            finalSocietyId = targetUser?.societyId;
            console.log('Fetched target user societyId:', finalSocietyId);
        }

        // If still no societyId, we might need a fallback or fail gracefully
        // For now, assuming at least one party has a society, or we default to existing society of the target.
        // If strictly platform-to-platform (no society), this schema will fail. 
        // We really should make societyId optional in schema for Platform chats, but for now:
        if (!finalSocietyId) {
             console.log('Still no societyId. Failing.');
             // Fallback for purely platform-level chats if necessary, 
             // but schema requires INT. We might need to find *any* society orhandle this limit.
             // For now, let's hope one user is in a society.
             // As a patch, if really null, use 1 (system) if it exists, but unsafe.
             // Better: Return error if impossible.
             return res.status(400).json({ error: 'Cannot create conversation: No linked society found.' });
        }

        console.log('Creating conversation with societyId:', finalSocietyId);
        conversation = await prisma.conversation.create({
          data: {
            societyId: finalSocietyId,
            type: 'DIRECT',
            participantId: uidA,
            directParticipantId: uidB
          }
        });
        console.log('Conversation created:', conversation);
      } else {
          console.log('Found existing conversation:', conversation);
      }

      res.json(conversation);
    } catch (error) {
      console.error('Start Conversation Error Stack:', error.stack);
      console.error('Start Conversation Error Message:', error.message);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  }
}

module.exports = ChatController;
