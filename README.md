# DropCart Backend 🛍️  

## 🚀 About the Project  
This is the **backend** of DropCart, a full-stack e-commerce application built with the **MERN stack**. It provides APIs for user authentication, product management, cart handling, orders, and secure payment integration using **Razorpay**.  

## 🛠 Tech Stack  
- **Framework:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (stored in cookies)  
- **Payment Gateway:** Razorpay  
- **Hosting:** Render  

---

## 📌 Features  
✅ User authentication (Register, Login, Logout)  
✅ Secure JWT authentication with cookies  
✅ Product management API with filtering & pagination  
✅ Cart & wishlist API  
✅ Order processing & Razorpay integration  
✅ Middleware for error handling and authentication  

---

## 🖼 API Endpoints  

### **Auth Routes** 🔑  
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |

### **Product Routes** 🛒  
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/products` | Get all products (with filters & pagination) |
| `GET` | `/api/products/:id` | Get a single product |

### **Cart Routes** 🛍️  
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/cart` | Add item to cart |
| `GET` | `/api/cart` | Get cart items |
| `DELETE` | `/api/cart/:id` | Remove item from cart |

### **Order & Payment Routes** 💳  
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/orders` | Place an order |
| `GET` | `/api/orders/:userId` | Get user orders |
| `POST` | `/api/payments` | Process payment via Razorpay |

---

## 🔧 Installation & Setup  

### 1️⃣ Clone the repository  
```sh
git clone https://github.com/yourusername/dropcart-backend.git
cd dropcart-backend
