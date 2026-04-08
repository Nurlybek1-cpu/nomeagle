<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scenarios', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->string('slug');

            $table->string('type')->default('decision')->index();

            $table->text('prompt');

            $table->json('payload')->nullable();

            $table->unsignedInteger('order')->default(1);

            $table->unsignedInteger('xp_reward')->default(0);

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index('lesson_id');
            $table->index('order');

            $table->unique(['lesson_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scenarios');
    }
};
