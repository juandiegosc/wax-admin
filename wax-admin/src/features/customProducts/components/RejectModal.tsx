import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  reason: z.string().min(1, 'El motivo es requerido'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  isPending: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

export const RejectModal = ({ isPending, onConfirm, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    onConfirm(data.reason);
  };

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <div className="admin-modal">
        <h3 className="admin-modal-title">Rechazar cotizacion</h3>
        <p className="admin-modal-description">
          Esta accion es irreversible. El cliente sera notificado con el motivo.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="admin-modal-form">
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="reason">
              Motivo del rechazo
            </label>
            <textarea
              id="reason"
              className="admin-input admin-textarea"
              rows={3}
              placeholder="Explica por que se rechaza esta cotizacion..."
              {...register('reason')}
            />
            {errors.reason && (
              <span className="admin-form-error">{errors.reason.message}</span>
            )}
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
            <button type="submit" className="admin-button admin-button-danger" disabled={isPending}>
              {isPending ? 'Rechazando...' : 'Rechazar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
