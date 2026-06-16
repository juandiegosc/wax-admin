import type { QuotationRule } from '@/features/quotationRules/types/quotationRule';

type QuotationRuleTableProps = {
  rules: QuotationRule[];
  onEdit: (rule: QuotationRule) => void;
  onDelete: (rule: QuotationRule) => void;
};

export const QuotationRuleTable = ({ rules, onEdit, onDelete }: QuotationRuleTableProps) => {
  if (!rules || rules.length === 0) {
    return (
      <div className="admin-empty-state">
        <p>No hay reglas de cotización</p>
      </div>
    );
  }

  return (
    <div className="admin-table-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Clave</th>
            <th>Valor</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id}>
              <td>
                {rule.key}
                {rule.isDefault && <span className="admin-status is-draft">Default</span>}
              </td>
              <td>{rule.value}</td>
              <td>{rule.description ?? '—'}</td>
              <td>
                <span className={rule.isActive ? 'admin-status is-live' : 'admin-status is-draft'}>
                  {rule.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td>
                <div className="admin-table-actions">
                  <button
                    type="button"
                    className="admin-button admin-button-sm"
                    onClick={() => onEdit(rule)}
                  >
                    Editar
                  </button>
                  {!rule.isDefault && (
                    <button
                      type="button"
                      className="admin-button admin-button-sm admin-button-danger"
                      onClick={() => onDelete(rule)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
