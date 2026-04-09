<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CountryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'region' => $this->region,
            'description' => $this->description,
            'flagPath' => $this->flag_path,
            'flagUrl' => $this->flag_path
                ? Storage::disk('public')->url($this->flag_path)
                : null,
            'isActive' => $this->is_active,
            'ethnicGroups' => $this->ethnic_groups ?? [],
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
        ];
    }
}
