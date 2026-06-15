import { useState } from 'react';
import type { QuotationRule } from '@/features/quotationRules/types/quotationRule';

type QuotationRuleFormValues = {
  key: string;
  value: number;
  description: string;
  isActive: boolean;
};

type QuotationRuleFormModalProps = {
  rule: QuotationRule | null;
  isPending: boolean;
  onSubmit: (values: QuotationRuleFormValues) => void;
  onCancel: () => void;
};

export const QuotationRuleFormModal = ({
  rule,
  isPending,
  onSubmit,
  onCancel,
}: QuotationRuleFormModalProps) => {
  const isEdit = Boolean(rule);
  const [key, setKey] = useState(rule?.key ?? '');
  const [value, setValue] = useState(rule ? String(rule.value) : '');
  const [description, setDescription] = useState(rule?.description ?? '');
  const [isActive, setIsActive] = useState(rule?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ key: key.trim(), value: Number(value), description: description.trim(), isActive });
  };

  const canSubmit = key.trim() !== '' && value !== '' && !Number.isNaN(Number(value));

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="admin-modal-title">{isEdit ? 'Editar regla' : 'Nueva regla'}</h3>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="rule-key">Clave</label>
            <input
              id="rule-key"
              className="admin-form-input"
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={isEdit}
              placeholder="ej. base_price_bag"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="rule-value">Valor</label>
            <input
              id="rule-value"
              className="admin-form-input"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="ej. 500"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="rule-description">Descripción</label>
            <textarea
              id="rule-description"
              className="admin-form-input admin-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Para qué sirve esta regla"
            />
          </div>

          {isEdit && (
            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span>Regla activa</span>
            </label>
          )}

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-button admin-button-ghost"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancelar
            </button>
            <button type="submit" className="admin-button" disabled={isPending || !canSubmit}>
              {isPending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear regla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
