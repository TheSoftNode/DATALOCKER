# Vercel Deployment Guide

## 🚀 Deploy DataLocker to Vercel

### **Quick Deployment Steps:**

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from datalocker-ui directory**:
   ```bash
   cd datalocker-ui
   vercel --prod
   ```

### **Alternative: Deploy via Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project" 
3. Import your GitHub repository (or upload folder)
4. Select the `datalocker-ui` folder as root
5. Framework should auto-detect as "Next.js"
6. Click "Deploy"

### **Environment Variables (if needed)**

No environment variables are required as all contract addresses are hardcoded in the config.

### **Build Configuration**

✅ **Build Command**: `npm run build`  
✅ **Output Directory**: `.next`  
✅ **Install Command**: `npm install`  
✅ **Framework**: Next.js 15  

### **Post-Deployment**

After deployment, your DataLocker dApp will be available at:
- `https://your-project-name.vercel.app`

Update your hackathon submission with this live URL!

### **Features Working on Vercel:**

✅ Static file serving  
✅ Wallet connection (RainbowKit)  
✅ Contract interaction (Wagmi)  
✅ Real-time data fetching  
✅ File upload functionality  
✅ Responsive design  

### **Demo for Judges:**

Instead of localhost:3001, you can now demo:
`https://your-project-name.vercel.app`

This gives your project a professional, public URL that judges can access anytime! 🎉

---

**Your DataLocker project is now production-ready and deployable to the web!** 🚀
