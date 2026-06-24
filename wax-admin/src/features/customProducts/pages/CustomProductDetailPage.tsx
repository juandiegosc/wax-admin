import '@google/model-viewer';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useCustomProduct } from '@/features/customProducts/hooks/useCustomProducts';
import { useUsers } from '@/features/users/hooks/useUsers';
import { meshyUrl } from '@/features/customProducts/utils/meshyUrl';
import {
  useApproveCustomProduct,
  useProposePrice,
  useRejectCustomProduct,
} from '@/features/customProducts/hooks/useCustomProductMutations';
import { ProposePriceModal } from '@/features/customProducts/components/ProposePriceModal';
import { RejectModal } from '@/features/customProducts/components/RejectModal';
import { routePaths } from '@/routes/routePaths';
import type { CustomProductStatus } from '@/features/customProducts/types/customProduct';

const STATUS_LABELS: Record<CustomProductStatus, string> = {
  PendingQuotation: 'Pendiente',
  AwaitingAdminReview: 'Requiere revision',
  AwaitingCustomerReview: 'Esperando cliente',
  Approved: 'Aprobado',
  Rejected: 'Rechazado',
  AddedToBasket: 'En carrito',
};

const STATUS_CLASS: Record<CustomProductStatus, string> = {
  PendingQuotation: 'is-draft',
  AwaitingAdminReview: 'is-alert',
  AwaitingCustomerReview: 'is-draft',
  Approved: 'is-live',
  Rejected: 'is-alert',
  AddedToBasket: 'is-live',
};

const SOURCE_LABELS: Record<string, string> = {
  Admin: 'Admin',
  Customer: 'Cliente',
};

const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const CustomProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useCustomProduct(id!);
  const { data: users } = useUsers();
  const client = users?.find((u) => u.id === product?.ownerUserId);

  const proposeMutation = useProposePrice();
  const rejectMutation = useRejectCustomProduct();
  const approveMutation = useApproveCustomProduct();

  const [showProposeModal, setShowProposeModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error('Cotizacion no encontrada');
      navigate(routePaths.quotations, { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return <div className="admin-canvas" aria-label="Cargando cotizacion" />;
  }

  if (!product) return null;

  const lastProposal = product.proposals.at(-1);
  // It's the admin's turn only in AwaitingAdminReview. In AwaitingCustomerReview the customer acts.
  const isAdminTurn = product.status === 'AwaitingAdminReview';
  const isCustomerTurn = product.status === 'AwaitingCustomerReview';
  // In AwaitingAdminReview the admin must always propose (step 2 of the flow: required even if
  // they agree with the system quote; step 4: counter the customer).
  const canPropose = isAdminTurn;
  // Admin can only approve when the customer made the latest counter-offer.
  // A freshly submitted quote has a System proposal — admin must propose first, not approve.
  const canApprove = isAdminTurn && lastProposal?.source === 'Customer';
  // Reject is part of the admin's turn only.
  const canReject = isAdminTurn;

  const handlePropose = (amount: number, comment?: string) => {
    proposeMutation.mutate(
      { id: product.id, amount, comment },
      { onSettled: () => setShowProposeModal(false) },
    );
  };

  const handleReject = (reason: string) => {
    rejectMutation.mutate(
      { id: product.id, reason },
      { onSettled: () => setShowRejectModal(false) },
    );
  };

  const handleApprove = () => {
    approveMutation.mutate(product.id);
  };

  return (
    <div className="admin-ticket-detail">
      <div className="admin-product-page-header">
        <div className="admin-ticket-detail-top">
          <div>
            <span className="admin-section-label">Cotizaciones</span>
            <h2 className="admin-product-page-title">{product.name}</h2>
          </div>
          <div className="admin-table-actions">
            <span className={`admin-status ${STATUS_CLASS[product.status]}`}>
              {STATUS_LABELS[product.status]}
            </span>
            <button
              type="button"
              className="admin-button admin-button-ghost"
              onClick={() => navigate(routePaths.quotations)}
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      <div className="admin-order-summary-grid">
        <div className="admin-card">
          <span className="admin-form-label">Cliente</span>
          {client ? (
            <p>{client.email}</p>
          ) : (
            <p style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{product.ownerUserId}</p>
          )}
        </div>
        <div className="admin-card">
          <span className="admin-form-label">Fecha de solicitud</span>
          <p>{formatDate(product.createdAt)}</p>
        </div>
        {product.agreedPrice != null && (
          <div className="admin-card">
            <span className="admin-form-label">Precio acordado</span>
            <p>{formatPrice(product.agreedPrice)}</p>
          </div>
        )}
      </div>

      <div className="admin-quotation-body">
        <div className="admin-card">
          <span className="admin-form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
            Diseno
          </span>
          <div className="admin-quotation-design-grid">
            {[
              ['Tipo', product.design.type],
              ['Material', product.design.material],
              ['Color', product.design.color],
              ['Forma', product.design.shape],
              ['Dimensiones', product.design.dimensions],
              product.design.details ? ['Detalles', product.design.details] : null,
            ]
              .filter((x): x is [string, string] => x !== null)
              .map(([label, value]) => (
                <div key={label} className="admin-quotation-design-field">
                  <span className="admin-form-label">{label}</span>
                  <p>{value || '—'}</p>
                </div>
              ))}
          </div>
          {product.description && (
            <div style={{ marginTop: '1rem' }}>
              <span className="admin-form-label">Descripcion original</span>
              <p style={{ marginTop: '0.35rem', color: 'var(--wax-admin-muted)', fontSize: '0.9rem' }}>
                {product.description}
              </p>
            </div>
          )}
        </div>

        <div className="admin-card admin-quotation-model-card">
          <span className="admin-form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
            Modelo 3D
          </span>
          {product.glbUrl ? (
            <>
              <div className="admin-quotation-model-viewer">
                <model-viewer
                  src={meshyUrl(product.glbUrl)}
                  camera-controls="true"
                  auto-rotate="true"
                  shadow-intensity="1"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', background: '#f2f1ed' }}
                />
              </div>
              <p className="admin-quotation-model-hint">
                Arrastra para rotar · Pellizca o usa la rueda para hacer zoom
              </p>
              <a
                href={product.glbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-button admin-button-ghost admin-button-sm"
              >
                ↓ Descargar GLB
              </a>
            </>
          ) : (
            <p style={{ color: 'var(--wax-admin-muted)' }}>Sin modelo disponible</p>
          )}
        </div>
      </div>

      <div className="admin-card">
        <span className="admin-form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
          Historial de propuestas
        </span>
        {product.proposals.length === 0 ? (
          <p style={{ color: 'var(--wax-admin-muted)' }}>Sin propuestas aun</p>
        ) : (
          <div className="admin-quotation-proposals">
            {product.proposals.map((p) => (
              <div
                key={p.id}
                className={`admin-quotation-proposal ${p.source === 'Admin' ? 'is-admin' : 'is-customer'}`}
              >
                <div className="admin-quotation-proposal-header">
                  <span className="admin-quotation-proposal-source">
                    {SOURCE_LABELS[p.source]}
                  </span>
                  <span className="admin-quotation-proposal-amount">{formatPrice(p.amount)}</span>
                  {p.isAccepted && (
                    <span className="admin-status is-live" style={{ fontSize: '0.72rem' }}>
                      Aceptado
                    </span>
                  )}
                </div>
                {p.comment && (
                  <p className="admin-quotation-proposal-comment">{p.comment}</p>
                )}
                <span className="admin-quotation-proposal-date">{formatDate(p.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAdminTurn && (
        <div className="admin-quotation-actions">
          {canApprove && (
            <button
              type="button"
              className="admin-button"
              onClick={handleApprove}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? 'Aprobando...' : 'Aprobar propuesta del cliente'}
            </button>
          )}
          {canPropose && (
            <button
              type="button"
              className="admin-button"
              onClick={() => setShowProposeModal(true)}
            >
              Proponer precio
            </button>
          )}
          {canReject && (
            <button
              type="button"
              className="admin-button admin-button-danger"
              onClick={() => setShowRejectModal(true)}
            >
              Rechazar
            </button>
          )}
        </div>
      )}

      {isCustomerTurn && (
        <div className="admin-quotation-actions">
          <p style={{ color: 'var(--wax-admin-muted)', fontSize: '0.9rem' }}>
            Esperando que el cliente responda a tu propuesta.
          </p>
        </div>
      )}

      {showProposeModal && (
        <ProposePriceModal
          isPending={proposeMutation.isPending}
          suggestedAmountUsd={product.price / 100}
          onConfirm={handlePropose}
          onCancel={() => setShowProposeModal(false)}
        />
      )}

      {showRejectModal && (
        <RejectModal
          isPending={rejectMutation.isPending}
          onConfirm={handleReject}
          onCancel={() => setShowRejectModal(false)}
        />
      )}
    </div>
  );
};
