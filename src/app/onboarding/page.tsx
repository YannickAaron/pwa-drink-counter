"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AppLayout } from "~/app/_components/AppLayout";
import { api } from "~/trpc/react";

interface OnboardingFormData {
  nickname: string;
  age: number;
  gender: string;
  weight: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<OnboardingFormData>({
    defaultValues: {
      nickname: "",
      age: 25,
      gender: "",
      weight: 70,
    },
  });

  const upsertProfile = api.profile.upsertProfile.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      await upsertProfile.mutateAsync({
        nickname: data.nickname,
        age: Number(data.age),
        gender: data.gender || undefined,
        weight: data.weight ? Number(data.weight) : undefined,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout showNavigation={false} title="Welcome to Drink Counter">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold">Let's Get Started!</h2>
          <p className="text-white/70">
            Tell us a bit about yourself to get personalized stats.
          </p>
        </div>

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

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-indigo-600 px-4 py-3 text-lg font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Get Started! 🍻"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}