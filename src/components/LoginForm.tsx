"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/schemas/auth";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

export function LoginForm() {
  const { login } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      const success = await login(data.email, data.password);
      if (!success) {
        toast.error("Error with your credentials. Please Try Again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error with your credentials. Please Try Again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  function onError() {
    toast.error("Error with your credentials. Please Try Again.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('/images/login_background.jpg')] bg-cover bg-center">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">ACCOUNT LOGIN</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Email"
                          type="email"
                          className="pl-10"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            toast.dismiss();
                          }}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Password"
                          className="pl-10"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            toast.dismiss();
                          }}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {form.formState.isSubmitting ? "LOGGING IN..." : "LOGIN"}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-gray-600">
            Dont have an account?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              Register Account{" "}
              <span className="inline-flex">
                <ArrowRight className="text-lg pt-2" />
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
