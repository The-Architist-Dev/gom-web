// Mock API Service for local development without backend
// This allows testing UI without running the real backend

const MOCK_USER = {
  id: 1,
  name: "Nguyễn Văn Test",
  email: "test@thearchivist.com",
  role: "user",
  avatar: null,
  token_balance: 10,
  free_predictions_used: 2,
  free_limit: 5,
  created_at: "2024-01-01T00:00:00.000000Z"
};

const MOCK_ADMIN_USER = {
  ...MOCK_USER,
  name: "Admin Test",
  email: "admin@thearchivist.com",
  role: "admin"
};

const MOCK_CERAMIC_LINES = [
  {
    id: 1,
    name: "Gốm Chu Đậu",
    era: "Thế kỷ 15-16",
    origin: "Hải Dương",
    country: "Việt Nam",
    style: "Men trắng ngà, Hoa văn nâu đen, Đơn giản mộc mạc",
    description: "Gốm Chu Đậu là một trong những dòng gốm cổ nổi tiếng của Việt Nam, được sản xuất tại làng Chu Đậu, tỉnh Hải Dương từ thế kỷ 15-16. Đặc trưng bởi men trắng ngà, hoa văn nâu đen đơn giản nhưng tinh tế, thể hiện nét đẹp mộc mạc của văn hóa dân gian Việt Nam.",
    image_url: "https://i.pinimg.com/1200x/ca/57/35/ca5735c6a579334d55e7ad3711640a6e.jpg",
    featured: true
  },
  {
    id: 2,
    name: "Gốm Bát Tràng",
    era: "Thế kỷ 14-nay",
    origin: "Hà Nội",
    country: "Việt Nam",
    style: "Men men trắng, Hoa văn xanh cobalt, Tinh xảo",
    description: "Bát Tràng là làng gốm truyền thống lâu đời nhất Việt Nam, nổi tiếng với kỹ thuật tráng men trắng tinh khôi và vẽ hoa văn xanh cobalt tinh xảo. Sản phẩm Bát Tràng từng được xuất khẩu sang nhiều nước châu Á.",
    image_url: "https://i.pinimg.com/736x/8e/3a/0e/8e3a0e3c8f8e8f8e8f8e8f8e8f8e8f8e.jpg",
    featured: true
  },
  {
    id: 3,
    name: "Gốm Thanh Hóa",
    era: "Thế kỷ 11-15",
    origin: "Thanh Hóa",
    country: "Việt Nam",
    style: "Men nâu, Hoa văn khắc nổi, Phong cách Champa",
    description: "Gốm Thanh Hóa mang đậm ảnh hưởng văn hóa Champa với men nâu đặc trưng và kỹ thuật khắc hoa văn nổi tinh xảo. Đây là một trong những trung tâm gốm cổ quan trọng của miền Bắc Việt Nam.",
    image_url: "https://i.pinimg.com/736x/9f/2b/1c/9f2b1c2d3e4f5a6b7c8d9e0f1a2b3c4d.jpg",
    featured: true
  }
];

const MOCK_PREDICTION_RESULT = {
  final_report: {
    final_prediction: "Gốm Chu Đậu",
    final_country: "Việt Nam",
    final_era: "Thế kỷ 15-16",
    certainty: 87,
    reasoning: "Dựa trên phân tích hoa văn, màu men và kỹ thuật tạo hình, hiện vật này có đặc điểm rất giống với gốm Chu Đậu thời kỳ hoàng kim. Men trắng ngà đặc trưng, hoa văn nâu đen đơn giản nhưng tinh tế."
  },
  agent_predictions: [
    {
      agent_name: "Chuyên gia Hoa văn",
      prediction: { ceramic_line: "Chu Đậu" },
      debate_details: {
        attacks: [
          "Hoa văn có thể là của gốm Bát Tràng thời kỳ đầu",
          "Màu men hơi khác so với Chu Đậu chuẩn"
        ],
        defense: "Phong cách vẽ hoa văn nâu đen trên nền trắng ngà là đặc trưng không thể nhầm lẫn của Chu Đậu. Kỹ thuật tô vẽ tự do, không cầu kỳ phù hợp với phong cách dân gian thế kỷ 15-16."
      }
    },
    {
      agent_name: "Chuyên gia Kỹ thuật",
      prediction: { ceramic_line: "Chu Đậu" },
      debate_details: {
        attacks: [
          "Độ dày thành bình cần kiểm tra kỹ hơn"
        ],
        defense: "Kỹ thuật nung ở nhiệt độ trung bình tạo men trắng ngà mờ đục là đặc trưng của lò Chu Đậu. Cấu trúc đất sét và phương pháp tạo hình hoàn toàn phù hợp."
      }
    },
    {
      agent_name: "Chuyên gia Lịch sử",
      prediction: { ceramic_line: "Chu Đậu" },
      debate_details: {
        attacks: [],
        defense: "Phong cách trang trí đơn giản, mộc mạc phản ánh văn hóa dân gian Việt Nam thế kỷ 15-16. Đây là thời kỳ hoàng kim của làng gốm Chu Đậu, khi sản phẩm được ưa chuộng trong dân gian."
      }
    }
  ]
};

const MOCK_HISTORY = [
  {
    id: 1,
    prediction: "Gốm Chu Đậu",
    country: "Việt Nam",
    era: "Thế kỷ 15-16",
    certainty: 87,
    image_url: "https://i.pinimg.com/1200x/ca/57/35/ca5735c6a579334d55e7ad3711640a6e.jpg",
    created_at: "2024-01-15T10:30:00Z",
    data: MOCK_PREDICTION_RESULT
  },
  {
    id: 2,
    prediction: "Gốm Bát Tràng",
    country: "Việt Nam",
    era: "Thế kỷ 18",
    certainty: 92,
    image_url: "https://i.pinimg.com/736x/8e/3a/0e/8e3a0e3c8f8e8f8e8f8e8f8e8f8e8f8e.jpg",
    created_at: "2024-01-14T15:20:00Z",
    data: MOCK_PREDICTION_RESULT
  }
];

const MOCK_TRANSACTIONS = [
  {
    id: 1,
    amount: 100000,
    tokens: 10,
    status: "completed",
    payment_method: "VNPay",
    created_at: "2024-01-10T09:00:00Z"
  },
  {
    id: 2,
    amount: 50000,
    tokens: 5,
    status: "completed",
    payment_method: "MoMo",
    created_at: "2024-01-05T14:30:00Z"
  }
];

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Auth endpoints
  login: async (credentials) => {
    await delay();
    const isAdmin = credentials.email === "admin@test.com";
    const user = isAdmin ? MOCK_ADMIN_USER : MOCK_USER;
    return {
      data: {
        token: "mock_token_" + Date.now(),
        user
      }
    };
  },

  register: async (data) => {
    await delay();
    return {
      data: {
        token: "mock_token_" + Date.now(),
        user: { ...MOCK_USER, name: data.name, email: data.email }
      }
    };
  },

  loginSocial: async (provider, token) => {
    await delay();
    return {
      data: {
        token: "mock_token_" + Date.now(),
        user: { ...MOCK_USER, name: `${provider} User` }
      }
    };
  },

  forgotPassword: async (email) => {
    await delay();
    return { data: { message: "Reset code sent" } };
  },

  resetPassword: async (data) => {
    await delay();
    return { data: { message: "Password reset successful" } };
  },

  // User endpoints
  getUser: async () => {
    await delay();
    return { data: MOCK_USER };
  },

  updateProfile: async (formData) => {
    await delay();
    return { data: { ...MOCK_USER, name: formData.get('name') } };
  },

  updatePassword: async (data) => {
    await delay();
    return { data: { message: "Password updated" } };
  },

  // Ceramic lines
  getCeramicLines: async (params) => {
    await delay();
    return { data: { data: MOCK_CERAMIC_LINES } };
  },

  // Prediction
  predict: async (formData) => {
    await delay(1500); // Longer delay for prediction
    return {
      data: {
        data: MOCK_PREDICTION_RESULT,
        quota: {
          free_used: 3,
          free_limit: 5,
          token_balance: 9
        }
      }
    };
  },

  // History
  getHistory: async () => {
    await delay();
    return { data: { data: MOCK_HISTORY } };
  },

  // Transactions
  getTransactions: async () => {
    await delay();
    return { data: { data: MOCK_TRANSACTIONS } };
  },

  // AI Chat
  chat: async (question) => {
    await delay(800);
    return {
      data: {
        data: {
          answer: `Đây là câu trả lời mock cho câu hỏi: "${question}". Trong môi trường thực tế, AI sẽ phân tích và trả lời dựa trên cơ sở dữ liệu gốm sứ.`,
          sources: ["Bách khoa toàn thư gốm Việt Nam", "Lịch sử gốm Chu Đậu"],
          tokens_charged: 1
        }
      }
    };
  },

  // Payment
  createPayment: async (data) => {
    await delay();
    return {
      data: {
        payment_url: "https://mock-payment-gateway.com/pay?order=" + Date.now()
      }
    };
  },

  // Admin endpoints
  getAdminStats: async () => {
    await delay();
    return {
      data: {
        total_users: 150,
        total_predictions: 1250,
        total_revenue: 15000000,
        active_users: 45
      }
    };
  },

  getAdminUsers: async () => {
    await delay();
    return {
      data: {
        data: [
          MOCK_USER,
          MOCK_ADMIN_USER,
          { ...MOCK_USER, id: 3, name: "User 3", email: "user3@test.com" }
        ]
      }
    };
  },

  getAdminCeramics: async () => {
    await delay();
    return { data: { data: MOCK_CERAMIC_LINES } };
  },

  getAdminPayments: async () => {
    await delay();
    return { data: { data: MOCK_TRANSACTIONS } };
  },

  getAdminPredictions: async () => {
    await delay();
    return { data: { data: MOCK_HISTORY } };
  }
};

// Helper to check if mock mode is enabled
export const isMockMode = () => {
  return process.env.REACT_APP_MOCK_MODE === 'true';
};
