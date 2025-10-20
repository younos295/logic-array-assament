// Mock data
const MOCK_REFERRALS: Referral[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+8801712345678',
    status: 'pending',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  // Add more mock referrals (15-25 items total)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: (i + 2).toString(),
    name: `User ${i + 2}`,
    email: `user${i + 2}@example.com`,
    phone: `+88017${Math.floor(1000000 + Math.random() * 9000000)}`,
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)] as ReferralStatus,
    date: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 30)).toISOString(),
  })),
];

// Mock API service
export default {
  // Simulate network delay
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 500));
  },

  // Get user profile
  async getMyProfile() {
    await this.delay();
    return {
      id: 'user-123',
      name: 'Current User',
      email: 'user@example.com',
      referralCode: 'REF12345',
    };
  },

  // Get referral history
  async getMyHistory(params: { page?: number; limit?: number; status?: string; search?: string } = {}) {
    await this.delay();
    
    // Simulate filtering and pagination
    let results = [...MOCK_REFERRALS];
    
    if (params.status && params.status !== 'all') {
      results = results.filter(r => r.status === params.status);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      results = results.filter(r => 
        r.name.toLowerCase().includes(searchLower) || 
        r.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Simulate pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: results.slice(start, end),
      total: results.length,
      page,
      limit,
    };
  },

  // Add manual referral
  async postManual(data: { name: string; email: string; phone?: string }) {
    await this.delay();
    
    // Check for duplicate email
    if (MOCK_REFERRALS.some(r => r.email === data.email)) {
      const error = new Error('Email already exists');
      (error as any).status = 409;
      throw error;
    }
    
    const newReferral: Referral = {
      id: (MOCK_REFERRALS.length + 1).toString(),
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      status: 'pending',
      date: new Date().toISOString(),
    };
    
    MOCK_REFERRALS.unshift(newReferral);
    return newReferral;
  },

  // Get points balance
  async getPoints() {
    await this.delay();
    return {
      current: 1250,
      lifetime: 2500,
    };
  },
};
