import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  amountUsd: z
    .number({ message: 'Ingresa un monto valido' })
    .positive('El monto debe ser mayor a 0'),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  isPending: boolean;
  /** Precio actual sobre la mesa, en USD (cotización del sistema o última oferta del cliente). */
  suggestedAmountUsd?: number;
  onConfirm: (amount: number, comment?: string) => void;
  onCancel: () => void;
};

export const ProposePriceModal = ({
  isPending,
  suggestedAmountUsd,
  onConfirm,
  onCancel,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amountUsd: suggestedAmountUsd },
  });

  const onSubmit = (data: FormValues) => {
    onConfirm(Math.round(data.amountUsd * 100), data.comment || undefined);
  };

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <div className="admin-modal">
        <h3 className="admin-modal-title">Proponer precio</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="admin-modal-form">
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="amountUsd">
              Monto (USD)
            </label>
            <input
              id="amountUsd"
              type="number"
              step="0.01"
              min="0.01"
              className="admin-input"
              placeholder="0.00"
              {...register('amountUsd', { valueAsNumber: true })}
            />
            {suggestedAmountUsd != null && (
              <span className="admin-form-hint">
                Pre-cargado con el precio actual. Envialo tal cual o editalo.
              </span>
            )}
            {errors.amountUsd && (
              <span className="admin-form-error">{errors.amountUsd.message}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="comment">
              Comentario (opcional)
            </label>
            <textarea
              id="comment"
              className="admin-input admin-textarea"
              rows={3}
              placeholder="Incluye detalles sobre el precio..."
              {...register('comment')}
            />
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-button admin-button-ghost"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancelar
            </button>
            <button type="submit" className="admin-button" disabled={isPending}>
              {isPending ? 'Enviando...' : 'Proponer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
