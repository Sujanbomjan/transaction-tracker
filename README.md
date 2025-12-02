# 💰 Financial Transaction Manager

A modern, enterprise-grade transaction tracker application built with Next.js, Redux Toolkit, and TypeScript. Effortlessly manage, filter, and visualize your data with interactive charts and real-time analytics.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)

## ✨ Features

- 📊 **Interactive Data Visualization** - Toggle between bar and pie charts with custom legends
- 🔍 **Advanced Filtering** - Multi-select category filters and transaction type filtering
- 📈 **Real-time Analytics** - Live calculations of income, expenses, and balance
- 📋 **Paginated Table** - Efficiently browse through large datasets with pagination
- ➕ **Transaction Management** - Add and delete transactions with form validation
- 🎨 **Beautiful UI** - Modern, responsive design with dark mode support
- ⚡ **Optimized Performance** - Memoized selectors and efficient state management
- 🔔 **Toast Notifications** - User-friendly feedback for all actions
- 💀 **Skeleton Loading** - Professional loading states throughout the app

## 🛠️ Tech Stack

### Core

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development

### State Management

- **Redux Toolkit** - Predictable state container
- **React Redux** - Official React bindings for Redux

### UI & Styling

- **shadcn/ui** - Beautifully designed component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Forms & Validation

- **React Hook Form** - Performant form management
- **Zod** - TypeScript-first schema validation

### Charts & Visualization

- **Recharts** - Composable charting library

### Utilities

- **date-fns** - Modern date utility library
- **Sonner** - Beautiful toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sujanbomjan/transaction-tracker.git
   cd transaction-tracker
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Add your transaction data**

   `src/public/data/TrackerTransaction.json` with your transaction data in the following format:

   ```json
   [
     {
       "id": 1,
       "description": "Salary",
       "amount": 5000,
       "type": "income",
       "category": "Salary",
       "date": "2024-01-01"
     }
   ]
   ```

4. **Run the development server**

   ```bash
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create production build
yarn build

# Start production server
yarn start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main dashboard page
│   └── globals.css             # Global styles
│
├── components/
│   ├── providers/
│   │   └── ReduxProvider.tsx   # Redux store provider
│   ├── SummaryCards.tsx        # Financial summary cards
│   ├── FilterSection.tsx       # Category & type filters
│   ├── TransactionTable.tsx    # Paginated transaction table
│   ├── ChartVisualization.tsx  # Interactive charts
│   ├── AddTransactionForm.tsx  # Add transaction form
│   └── ui/                     # shadcn/ui components
│
├── redux/
│   ├── store.ts                # Redux store configuration
│   └── features/
│       └── transactions/
│           └── transactionsSlice.ts  # Transaction state & selectors
│
└── data/
    └── TrackerTransaction.json # Transaction data
```

## 📊 Performance Optimizations

- ✅ Memoized Redux selectors
- ✅ React.memo for component optimization
- ✅ useCallback for event handlers
- ✅ Efficient re-render prevention
- ✅ Pagination for large datasets
