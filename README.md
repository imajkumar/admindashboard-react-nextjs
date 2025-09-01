# 🏢 Enterprise Admin Dashboard

A **modular, scalable, enterprise-ready admin dashboard** built with Next.js 14, React 18, TypeScript, and Ant Design. Designed for large-scale applications with multiple modules, complex permissions, and extensive customization options.

## 🚀 **Features**

### 🏗️ **Architecture**
- **Modular Design** - Scalable module-based architecture
- **TypeScript** - Full type safety throughout the application
- **Next.js 14** - App Router with server-side rendering
- **React 18** - Latest React features and performance
- **Ant Design** - Professional UI components and theming

### 🌍 **Multi-Language Support**
- **English & Russian** - Full localization support
- **RTL Support** - Right-to-left language support
- **Dynamic Language Switching** - Real-time language changes
- **Localized Validation** - Form validation messages in multiple languages

### 🎨 **Theme System**
- **Light/Dark Mode** - Automatic theme switching
- **Custom Color Schemes** - Configurable theme colors
- **Persistent Preferences** - Theme saved in localStorage
- **Responsive Design** - Mobile-first approach

### 🔐 **Authentication & Authorization**
- **Role-Based Access Control (RBAC)** - Granular permissions
- **JWT Authentication** - Secure token-based auth
- **Permission-Based Navigation** - Dynamic menu based on user roles
- **Session Management** - Secure session handling

### 📱 **Responsive & Accessible**
- **Mobile-First Design** - Optimized for all devices
- **Touch-Friendly Interface** - Gesture support
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - ARIA labels and roles

## 📁 **Project Structure**

```
adminfront/
├── public/                          # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── dashboard/              # Dashboard module
│   │   │   └── page.tsx           # Dashboard main page
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── page.tsx               # Login page
│   ├── components/                  # Reusable components
│   │   ├── forms/                 # Form components
│   │   │   └── UserCreationDrawer.tsx
│   │   └── navigation/            # Navigation components
│   │       ├── DynamicNavigation.tsx
│   │       ├── Breadcrumb.tsx
│   │       ├── LanguageSwitcher.tsx
│   │       └── ModuleMenu.tsx
│   ├── config/                      # Configuration files
│   │   ├── constants.ts           # Application constants
│   │   ├── theme.ts               # Theme configuration
│   │   ├── axios.ts               # Axios configuration
│   │   ├── modules.ts             # Module configuration
│   │   └── i18n.ts                # Internationalization config
│   ├── controllers/                 # Business logic controllers
│   │   ├── BaseController.ts      # Base controller class
│   │   └── users/                 # User module controllers
│   │       ├── index.ts           # User exports
│   │       └── UserController.ts  # User-specific controller
│   ├── contexts/                    # React contexts
│   │   ├── ThemeContext.tsx       # Theme management
│   │   └── LanguageContext.tsx    # Language management
│   ├── hooks/                       # Custom hooks
│   │   └── useAuth.ts             # Authentication hook
│   ├── services/                    # API services
│   │   ├── api.ts                 # Base API service
│   │   ├── authService.ts         # Authentication service
│   │   ├── userService.ts         # User management service
│   │   └── dashboardService.ts    # Dashboard service
│   └── utils/                       # Utility functions
│       └── iconUtils.tsx          # Icon management
├── .gitignore                       # Git ignore rules
├── .env.example                     # Environment variables example
├── biome.json                       # Biome configuration
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.mjs              # PostCSS configuration
├── PROJECT_STRUCTURE.md            # Detailed project documentation
├── README.md                       # This file
├── tsconfig.json                   # TypeScript configuration
└── package-lock.json               # Locked dependencies
```

## 🧩 **Module System**

### **Core Modules**
1. **Dashboard** (`/dashboard`) - Overview and statistics
2. **Users** (`/users`) - User management and roles
3. **Content** (`/content`) - Content management system
4. **E-Commerce** (`/ecommerce`) - Product and order management
5. **Analytics** (`/analytics`) - Data analytics and reporting
6. **Settings** (`/settings`) - System configuration
7. **Help** (`/help`) - Documentation and support

### **Module Features**
- **CRUD Operations** - Create, Read, Update, Delete
- **Bulk Actions** - Mass operations on multiple items
- **Search & Filtering** - Advanced search capabilities
- **Import/Export** - Data import and export functionality
- **Audit Logging** - Complete activity tracking
- **Permission-Based Access** - Role-based feature access

## 🔐 **Permission System**

### **Permission Levels**
- **`read`** - View data and reports
- **`write`** - Create and edit data
- **`delete`** - Remove data
- **`admin`** - Full administrative access

### **User Roles**
1. **Super Admin** - Full system access
2. **Admin** - Module-level administration
3. **Manager** - Team and content management
4. **User** - Basic access to assigned modules
5. **Guest** - Limited read-only access

## 🛠️ **Technology Stack**

### **Frontend**
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Ant Design** - UI component library
- **Tailwind CSS** - Utility-first CSS framework

### **Development Tools**
- **Biome** - Fast linter and formatter
- **Husky** - Git hooks for pre-commit checks
- **ESLint** - Code linting
- **Prettier** - Code formatting

### **State Management**
- **React Context** - Global state management
- **Local Storage** - Persistent data storage
- **Session Storage** - Temporary data storage

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adminfront
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### **Available Scripts**

```json
{
  "dev": "npm run build && next dev",     // Build + start dev server
  "build": "next build",                 // Production build
  "start": "next start",                 // Start production server
  "lint": "biome check",                 // Lint code
  "format": "biome format --write",      // Format code
  "type-check": "tsc --noEmit",          // Type checking
  "prepare": "husky install"             // Install Husky hooks
}
```

## 🔧 **Configuration**

### **Environment Variables**
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3002

# Application Settings
NEXT_PUBLIC_APP_NAME=Admin Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_LANGUAGE=en

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### **Theme Configuration**
```typescript
// src/config/theme.ts
export const lightTheme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
  }
};
```

## 📊 **Performance Features**

### **Optimizations**
- **Code Splitting** - Automatic bundle splitting
- **Lazy Loading** - Component lazy loading
- **Image Optimization** - Next.js image optimization
- **Static Generation** - Pre-rendered pages
- **Caching** - Intelligent caching strategies

### **Monitoring**
- **Performance Metrics** - Core Web Vitals tracking
- **Error Logging** - Comprehensive error tracking
- **User Analytics** - User behavior insights
- **System Health** - Application monitoring

## 🔒 **Security Features**

### **Authentication**
- **JWT Tokens** - Secure token-based authentication
- **Token Refresh** - Automatic token renewal
- **Session Management** - Secure session handling
- **Multi-Factor Authentication** - Enhanced security (future)

### **Data Protection**
- **Input Validation** - Comprehensive data validation
- **XSS Protection** - Cross-site scripting prevention
- **CSRF Protection** - Cross-site request forgery protection
- **Data Encryption** - Sensitive data encryption (future)

## 🌐 **Deployment**

### **Production Build**
```bash
npm run build
npm start
```

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Environment-Specific Configs**
- **Development** - Local development settings
- **Staging** - Pre-production testing
- **Production** - Live environment settings

## 🤝 **Contributing**

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with conventional commits
6. **Push** to your branch
7. **Create** a pull request

### **Code Standards**
- **TypeScript** - Strict type checking
- **ESLint** - Code quality rules
- **Prettier** - Consistent formatting
- **Conventional Commits** - Standard commit messages

### **Testing**
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📈 **Roadmap**

### **Phase 1 - Core Features** ✅
- [x] Basic dashboard structure
- [x] User authentication
- [x] Multi-language support
- [x] Theme system
- [x] Modular architecture

### **Phase 2 - Advanced Features** 🚧
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Workflow automation
- [ ] API documentation
- [ ] Mobile app

### **Phase 3 - Enterprise Features** 📋
- [ ] Single Sign-On (SSO)
- [ ] LDAP integration
- [ ] Advanced reporting
- [ ] Multi-tenant support
- [ ] Microservices architecture

## 📞 **Support**

### **Documentation**
- **API Documentation** - Complete API reference
- **User Guide** - End-user documentation
- **Developer Guide** - Technical documentation
- **Troubleshooting** - Common issues and solutions

### **Community**
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Community discussions
- **Wiki** - Project wiki and guides

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Ant Design** - UI component library
- **Next.js Team** - React framework
- **Vercel** - Deployment platform
- **Open Source Community** - Contributors and maintainers

---

**Built with ❤️ for enterprise applications**
