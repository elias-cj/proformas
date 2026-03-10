<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        // Registrar el AuditObserver en modelos críticos
        \App\Models\Proforma::observe(\App\Observers\AuditObserver::class);
        \App\Models\WorkOrder::observe(\App\Observers\AuditObserver::class);
        \App\Models\CashMovement::observe(\App\Observers\AuditObserver::class);
        \App\Models\Contract::observe(\App\Observers\AuditObserver::class);
        \App\Models\Payment::observe(\App\Observers\AuditObserver::class);
        \App\Models\Expense::observe(\App\Observers\AuditObserver::class);
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
