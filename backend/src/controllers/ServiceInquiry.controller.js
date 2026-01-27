const prisma = require('../lib/prisma');

class ServiceInquiryController {
  static async listInquiries(req, res) {
    try {
      let { page = 1, limit = 10, search, status, societyId } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const skip = (page - 1) * limit;

      const where = {};
      
      // Role based filtering
      if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'super_admin') {
        where.societyId = req.user.societyId;
      } else if (societyId && societyId !== 'all') {
        where.societyId = parseInt(societyId);
      }

      // Filter by status
      if (status && status !== 'all') {
        where.status = status;
      }

      // Search
      if (search) {
        where.OR = [
          { residentName: { contains: search } },
          { serviceName: { contains: search } },
          { unit: { contains: search } }
        ];
      }

      const [total, inquiries] = await Promise.all([
        prisma.serviceInquiry.count({ where }),
        prisma.serviceInquiry.findMany({
          where,
          skip,
          take: limit,
          include: {
            society: {
              select: { name: true, pincode: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      res.json({
        data: inquiries,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('List Inquiries Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async createInquiry(req, res) {
    try {
      const { 
        residentName, 
        unit, 
        phone, 
        serviceName, 
        serviceId, 
        type, 
        preferredDate, 
        preferredTime, 
        notes 
      } = req.body;

      const inquiry = await prisma.serviceInquiry.create({
        data: {
          residentName,
          unit,
          phone,
          serviceName,
          serviceId,
          type: type || 'service',
          preferredDate,
          preferredTime,
          notes,
          societyId: req.user.societyId,
          residentId: req.user.id
        }
      });

      res.status(201).json(inquiry);
    } catch (error) {
      console.error('Create Inquiry Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async assignVendor(req, res) {
    try {
      const { id } = req.params;
      const { vendorId, vendorName } = req.body;
      console.log('Assign Vendor Request:', { id, vendorId, vendorName, userRole: req.user.role });
      
      const inquiry = await prisma.serviceInquiry.update({
        where: { id: parseInt(id) },
        data: {
          vendorId: parseInt(vendorId),
          vendorName,
          status: 'booked'
        }
      });
      res.json(inquiry);
    } catch (error) {
      console.error('Assign Vendor Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ServiceInquiryController;
