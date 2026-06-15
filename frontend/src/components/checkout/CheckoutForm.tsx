"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, MapPin, CreditCard, Package } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { addressSchema, type AddressInput } from "@/lib/validations";
import type { CheckoutFormData } from "@/types";

const steps = [
  { id: 1, title: "Shipping", icon: MapPin },
  { id: 2, title: "Payment", icon: CreditCard },
  { id: 3, title: "Confirm", icon: Package },
];

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading: boolean;
}

export function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");
  const [notes, setNotes] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "US",
    },
  });

  const handleNextStep = async () => {
    const valid = await trigger([
      "firstName",
      "lastName",
      "email",
      "phone",
      "street",
      "city",
      "state",
      "zipCode",
      "country",
    ]);
    if (valid) setCurrentStep(2);
  };

  const handleFormSubmit = () => {
    const address = getValues();
    onSubmit({
      shippingAddress: address,
      paymentMethod,
      notes,
    });
  };

  return (
    <div>
      {/* Step Indicators */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <motion.div
              animate={{
                backgroundColor:
                  currentStep >= step.id ? "#FF6B9D" : "#E5E7EB",
                color: currentStep >= step.id ? "#fff" : "#6B7280",
              }}
              className="flex items-center justify-center h-10 w-10 rounded-full font-semibold text-sm"
            >
              {currentStep > step.id ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-4 w-4" />
              )}
            </motion.div>
            <div className="ml-2 hidden sm:block">
              <p
                className={`text-sm font-medium ${
                  currentStep >= step.id
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-px w-12 mx-3 ${
                  currentStep > step.id ? "bg-primary" : "bg-gray-200 dark:bg-dark-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Shipping Address */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-5">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register("firstName")}
                error={errors.firstName?.message}
                placeholder="John"
              />
              <Input
                label="Last Name"
                {...register("lastName")}
                error={errors.lastName?.message}
                placeholder="Doe"
              />
              <Input
                label="Email Address"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                placeholder="john@example.com"
                className="sm:col-span-2"
              />
              <Input
                label="Phone Number"
                type="tel"
                {...register("phone")}
                error={errors.phone?.message}
                placeholder="+1 (555) 123-4567"
                className="sm:col-span-2"
              />
              <Input
                label="Street Address"
                {...register("street")}
                error={errors.street?.message}
                placeholder="123 Main St"
                className="sm:col-span-2"
              />
              <Input
                label="City"
                {...register("city")}
                error={errors.city?.message}
                placeholder="New York"
              />
              <Input
                label="State"
                {...register("state")}
                error={errors.state?.message}
                placeholder="NY"
              />
              <Input
                label="ZIP Code"
                {...register("zipCode")}
                error={errors.zipCode?.message}
                placeholder="10001"
              />
              <Input
                label="Country"
                {...register("country")}
                error={errors.country?.message}
                placeholder="US"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Order Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-3 py-2 text-sm text-gray-700 dark:text-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <Button className="mt-6 w-full group" onClick={handleNextStep}>
              Continue to Payment
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-5">
              Payment Method
            </h2>
            <div className="space-y-3 mb-6">
              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "stripe"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-dark-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="accent-primary"
                />
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-dark-text">
                    Credit / Debit Card
                  </p>
                  <p className="text-xs text-gray-500">Secured by Stripe</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {["VISA", "MC", "AMEX"].map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-bold bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-dark-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-primary"
                />
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-dark-text">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-500">Pay when you receive</p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={() => setCurrentStep(3)}
              >
                Review Order
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-5">
              Review & Confirm
            </h2>

            <div className="space-y-4 mb-6">
              {/* Address Summary */}
              <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="font-medium text-gray-900 dark:text-dark-text text-sm">
                    Shipping to
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getValues("firstName")} {getValues("lastName")}
                  <br />
                  {getValues("street")}, {getValues("city")},{" "}
                  {getValues("state")} {getValues("zipCode")}
                </p>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <p className="font-medium text-gray-900 dark:text-dark-text text-sm">
                    Payment
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {paymentMethod === "stripe"
                    ? "Credit/Debit Card (Stripe)"
                    : "Cash on Delivery"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleFormSubmit}
                loading={isLoading}
              >
                Place Order
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
