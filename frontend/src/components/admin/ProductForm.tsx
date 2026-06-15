"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "./ImageUpload";
import { productSchema, type ProductInput } from "@/lib/validations";
import type { Category, Product } from "@/types";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export function ProductForm({ product, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<string[]>(
    product?.ingredients || []
  );
  const [allergens, setAllergens] = useState<string[]>(
    product?.allergens || []
  );
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [newIngredient, setNewIngredient] = useState("");
  const [newAllergen, setNewAllergen] = useState("");
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 0,
      comparePrice: product?.comparePrice || undefined,
      description: product?.description || "",
      category: typeof product?.category === "object" ? product.category._id : product?.category || "",
      flavor: product?.flavor || "",
      stock: product?.stock || 0,
      isFeatured: product?.isFeatured || false,
      isActive: product?.isActive ?? true,
      weight: product?.weight || "",
      servingSize: product?.servingSize || "",
      images: product?.images || [],
      ingredients: product?.ingredients || [],
      allergens: product?.allergens || [],
      tags: product?.tags || [],
      nutritionFacts: product?.nutritionFacts || {
        calories: 0,
        fat: 0,
        protein: 0,
        carbs: 0,
        sugar: 0,
        sodium: 0,
      },
    },
  });

  const images = watch("images");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.data || d || []));
  }, []);

  const addItem = (
    list: string[],
    setList: (v: string[]) => void,
    item: string,
    fieldName: keyof ProductInput,
    setInput: (v: string) => void
  ) => {
    if (item.trim() && !list.includes(item.trim())) {
      const newList = [...list, item.trim()];
      setList(newList);
      setValue(fieldName as "ingredients" | "allergens" | "tags", newList);
      setInput("");
    }
  };

  const removeItem = (
    list: string[],
    setList: (v: string[]) => void,
    index: number,
    fieldName: keyof ProductInput
  ) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
    setValue(fieldName as "ingredients" | "allergens" | "tags", newList);
  };

  const onSubmit = async (data: ProductInput) => {
    data.ingredients = ingredients;
    data.allergens = allergens;
    data.tags = tags;

    try {
      const url = isEdit ? `/api/products/${product?._id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(
          isEdit ? "Product updated successfully!" : "Product created successfully!"
        );
        router.push("/admin/products");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save product");
      }
    } catch {
      toast.error("Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Images */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6">
        <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-4">
          Product Images
        </h3>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUpload
              images={field.value || []}
              onImagesChange={field.onChange}
            />
          )}
        />
        {errors.images && (
          <p className="mt-1 text-xs text-red-500">{errors.images.message}</p>
        )}
      </div>

      {/* Basic Info */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-dark-text">
          Basic Information
        </h3>

        <Input
          label="Product Name"
          {...register("name")}
          error={errors.name?.message}
          placeholder="e.g., Strawberry Dream Ice Cream"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Describe your ice cream..."
            className="w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm text-gray-700 dark:text-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Category
            </label>
            <select
              {...register("category")}
              className="w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          <Input
            label="Flavor"
            {...register("flavor")}
            error={errors.flavor?.message}
            placeholder="e.g., Strawberry"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Weight"
            {...register("weight")}
            placeholder="e.g., 500g"
          />
          <Input
            label="Serving Size"
            {...register("servingSize")}
            placeholder="e.g., 1/2 cup (65g)"
          />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-dark-text">
          Pricing & Inventory
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
            placeholder="9.99"
          />
          <Input
            label="Compare Price ($)"
            type="number"
            step="0.01"
            {...register("comparePrice", { valueAsNumber: true })}
            placeholder="12.99"
          />
          <Input
            label="Stock"
            type="number"
            {...register("stock", { valueAsNumber: true })}
            error={errors.stock?.message}
            placeholder="100"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="rounded accent-primary"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Featured Product
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isActive")}
              className="rounded accent-primary"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active (visible in store)
            </span>
          </label>
        </div>
      </div>

      {/* Nutrition */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-dark-text">
          Nutrition Facts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { key: "calories", label: "Calories" },
            { key: "fat", label: "Total Fat (g)" },
            { key: "protein", label: "Protein (g)" },
            { key: "carbs", label: "Carbohydrates (g)" },
            { key: "sugar", label: "Sugars (g)" },
            { key: "sodium", label: "Sodium (mg)" },
          ].map(({ key, label }) => (
            <Input
              key={key}
              label={label}
              type="number"
              step="0.1"
              {...register(`nutritionFacts.${key as keyof ProductInput["nutritionFacts"]}`, {
                valueAsNumber: true,
              })}
              placeholder="0"
            />
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-dark-text">
          Ingredients & Allergens
        </h3>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ingredients
          </label>
          <div className="flex gap-2 mb-2">
            <input
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Add ingredient..."
              className="flex-1 rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                addItem(
                  ingredients,
                  setIngredients,
                  newIngredient,
                  "ingredients",
                  setNewIngredient
                ))
              }
            />
            <Button
              type="button"
              size="icon"
              onClick={() =>
                addItem(
                  ingredients,
                  setIngredients,
                  newIngredient,
                  "ingredients",
                  setNewIngredient
                )
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(ingredients, setIngredients, i, "ingredients")}
                >
                  <X className="h-3.5 w-3.5 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Allergens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Allergens
          </label>
          <div className="flex gap-2 mb-2">
            <input
              value={newAllergen}
              onChange={(e) => setNewAllergen(e.target.value)}
              placeholder="Add allergen..."
              className="flex-1 rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                addItem(
                  allergens,
                  setAllergens,
                  newAllergen,
                  "allergens",
                  setNewAllergen
                ))
              }
            />
            <Button
              type="button"
              size="icon"
              onClick={() =>
                addItem(
                  allergens,
                  setAllergens,
                  newAllergen,
                  "allergens",
                  setNewAllergen
                )
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergens.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-red-100 text-red-600 rounded-full px-3 py-1 text-sm dark:bg-red-900/20"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(allergens, setAllergens, i, "allergens")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              className="flex-1 rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(),
                addItem(tags, setTags, newTag, "tags", setNewTag))
              }
            />
            <Button
              type="button"
              size="icon"
              onClick={() => addItem(tags, setTags, newTag, "tags", setNewTag)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeItem(tags, setTags, i, "tags")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} size="lg">
          {isEdit ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
