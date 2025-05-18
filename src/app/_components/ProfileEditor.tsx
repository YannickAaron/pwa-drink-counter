"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { api } from "~/trpc/react";

interface ProfileFormData {
  nickname: string;
  age: number;
  gender: string;
  weight: number;
}

export function ProfileEditor() {
  const { data: profile, isLoading } = api.profile.getProfile.useQuery();

  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = 
    useForm<ProfileFormData>({
      defaultValues: {
        nickname: "",
        age: 25,
        gender: "",
        weight: 70,
      },
    });

  // Update form with profile data when loaded
  useEffect(() => {
    if (profile) {
      reset({
        nickname: profile.nickname,
        age: profile.age,
        gender: profile.gender ?? "",
        weight: profile.weight ?? undefined,
      });
    }
  }, [profile, reset]);

  const updateProfile = api.profile.upsertProfile.useMutation({
    onSuccess: () => {
      // Refetch profile data
      void api.profile.getProfile.invalidate();
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        nickname: data.nickname,
        age: Number(data.age),
        gender: data.gender || undefined,
        weight: data.weight ? Number(data.weight) : undefined,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium">
            Nickname <span className="text-red-500">*</span>
          </label>
          <input
            id="nickname"
            type="text"
            className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="What should we call you?"
            {...register("nickname", { required: "Nickname is required" })}
          />
          {errors.nickname && (
            <p className="mt-1 text-sm text-red-500">{errors.nickname.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            id="age"
            type="number"
            min="18"
            max="120"
            className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            {...register("age", {
              required: "Age is required",
              min: { value: 18, message: "You must be at least 18 years old" },
              max: { value: 120, message: "Please enter a valid age" },
            })}
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium">
            Gender (optional)
          </label>
          <select
            id="gender"
            className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            {...register("gender")}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium">
            Weight in kg (optional)
          </label>
          <input
            id="weight"
            type="number"
            min="30"
            max="300"
            step="0.1"
            className="mt-1 block w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-white/50 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            placeholder="For more accurate stats"
            {...register("weight", {
              min: { value: 30, message: "Please enter a valid weight" },
              max: { value: 300, message: "Please enter a valid weight" },
            })}
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-500">{errors.weight.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Link
            href="/api/auth/signout"
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            Sign Out
          </Link>
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}