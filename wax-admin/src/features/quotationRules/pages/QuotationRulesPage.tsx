import { useState } from 'react';
import { QuotationRuleTable } from '@/features/quotationRules/components/QuotationRuleTable';
import { QuotationRuleFormModal } from '@/features/quotationRules/components/QuotationRuleFormModal';
import { DeleteQuotationRuleModal } from '@/features/quotationRules/components/DeleteQuotationRuleModal';
import { useQuotationRules } from '@/features/quotationRules/hooks/useQuotationRules';
import {
  useCreateQuotationRule,
  useUpdateQuotationRule,
  useDeleteQuotationRule,
} from '@/features/quotationRules/hooks/useQuotationRuleMutations';
import type { QuotationRule } from '@/features/quotationRules/types/quotationRule';

export const QuotationRulesPage = () => {
  const [activeOnly, setActiveOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState<QuotationRule | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<QuotationRule | null>(null);

  const { data: rules, isLoading } = useQuotationRules(activeOnly ? { activeOnly: true } : {});
  const createMutation = useCreateQuotationRule();
  const updateMutation = useUpdateQuotationRule();
  const deleteMutation = useDeleteQuotationRule();

  const openCreate = () => {
    setRuleToEdit(null);
    setFormOpen(true);
  };

  const openEdit = (rule: QuotationRule) => {
    setRuleToEdit(rule);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setRuleToEdit(null);
  };

  const handleSubmit = (values: {
    key: string;
    value: number;
    description: string;
    isActive: boolean;
  }) => {
    if (ruleToEdit) {
      updateMutation.mutate(
        { id: ruleToEdit.id, value: values.value, description: values.description, isActive: values.isActive },
        { onSuccess: closeForm },
      );
    } else {
      createMutation.mutate(
        { key: values.key, value: values.value, description: values.description },
        { onSuccess: closeForm },
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!ruleToDelete) return;
    deleteMutation.mutate(ruleToDelete.id, {
      onSettled: () => setRuleToDelete(null),
    });
  };

  return (
    <div className="admin-catalog">
      <div className="admin-catalog-header">
        <label className="admin-form-checkbox">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          <span>Solo activas</span>
        </label>
        <button type="button" className="admin-button" onClick={openCreate}>
          Nueva regla
        </button>
      </div>

      {isLoading ? (
        <div className="admin-canvas" aria-label="Cargando reglas" />
      ) : (
        <QuotationRuleTable
          rules={rules ?? []}
          onEdit={openEdit}
          onDelete={setRuleToDelete}
        />
      )}

      {formOpen && (
        <QuotationRuleFormModal
          rule={ruleToEdit}
          isPending={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {ruleToDelete && (
        <DeleteQuotationRuleModal
          rule={ruleToDelete}
          isPending={deleteMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setRuleToDelete(null)}
        />
      )}
    </div>
  );
};
