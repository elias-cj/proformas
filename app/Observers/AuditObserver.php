<?php

namespace App\Observers;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

class AuditObserver
{
    public function created(Model $model)
    {
        $this->logAction($model, 'create');
    }

    public function updated(Model $model)
    {
        // Don't log if no changes
        if (!$model->isDirty()) return;

        $this->logAction($model, 'update');
    }

    public function deleted(Model $model)
    {
        $this->logAction($model, 'delete');
    }

    protected function logAction(Model $model, $action)
    {
        $oldValues = $action !== 'create' ? $model->getOriginal() : null;
        $newValues = $action !== 'delete' ? $model->getAttributes() : null;

        // Limpiar timestamps si solo cambiaron they
        if ($action === 'update' && empty(array_except($model->getDirty(), ['updated_at']))) {
            return;
        }

        AuditLog::create([
            'user_id' => auth()->id() ?? 1, // Fallback para dev/cli
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip()
        ]);
    }
}
