import { createBrowserRouter, Navigate } from 'react-router';
import { AdminLayout } from '@/layouts/AdminLayout';
import { CatalogPage } from '@/features/catalog/pages/CatalogPage';
import { CreateProductPage } from '@/features/catalog/pages/CreateProductPage';
import { EditProductPage } from '@/features/catalog/pages/EditProductPage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { OrdersPage } from '@/features/orders/pages/OrdersPage';
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage';
import { SupportPage } from '@/features/support/pages/SupportPage';
import { SupportTicketPage } from '@/features/support/pages/SupportTicketPage';
import { CustomProductsPage } from '@/features/customProducts/pages/CustomProductsPage';
import { CustomProductDetailPage } from '@/features/customProducts/pages/CustomProductDetailPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { QuotationRulesPage } from '@/features/quotationRules/pages/QuotationRulesPage';
import { InvoicesPage } from '@/features/invoices/pages/InvoicesPage';
import { InvoiceDetailPage } from '@/features/invoices/pages/InvoiceDetailPage';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { LoginPage } from '@/pages/LoginPage';
import { RouteErrorPage } from '@/pages/RouteErrorPage';
import { RequiredAdminAuth } from '@/routes/RequiredAdminAuth';
import { routePaths } from '@/routes/routePaths';

export const router = createBrowserRouter([
  {
    path: routePaths.login,
    Component: LoginPage,
    ErrorBoundary: RouteErrorPage,
  },
  {
    path: routePaths.forbidden,
    Component: ForbiddenPage,
    ErrorBoundary: RouteErrorPage,
  },
  {
    Component: RequiredAdminAuth,
    children: [
      {
        path: routePaths.overview,
        Component: AdminLayout,
        ErrorBoundary: RouteErrorPage,
        children: [
          {
            index: true,
            element: <Navigate to={routePaths.orders} replace />,
          },
          {
            path: routePaths.catalog,
            Component: CatalogPage,
          },
          {
            path: routePaths.catalogNew,
            Component: CreateProductPage,
          },
          {
            path: routePaths.catalogEdit,
            Component: EditProductPage,
          },
          {
            path: routePaths.orders,
            Component: OrdersPage,
          },
          {
            path: routePaths.orderDetail,
            Component: OrderDetailPage,
          },
          {
            path: routePaths.users,
            Component: UsersPage,
          },
          {
            path: routePaths.support,
            Component: SupportPage,
          },
          {
            path: routePaths.supportTicket,
            Component: SupportTicketPage,
          },
          {
            path: routePaths.quotations,
            Component: CustomProductsPage,
          },
          {
            path: routePaths.quotationDetail,
            Component: CustomProductDetailPage,
          },
          {
            path: routePaths.reports,
            Component: ReportsPage,
          },
          {
            path: routePaths.quotationRules,
            Component: QuotationRulesPage,
          },
          {
            path: routePaths.invoices,
            Component: InvoicesPage,
          },
          {
            path: routePaths.invoiceDetail,
            Component: InvoiceDetailPage,
          },
          {
            path: routePaths.content,
            Component: DashboardPage,
          },
          {
            path: routePaths.notFound,
            Component: DashboardPage,
          },
        ],
      },
    ],
  },
]);