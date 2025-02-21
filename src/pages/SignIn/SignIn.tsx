import React, { ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AUTH } from "@/api/signin";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/context/GlobalContext";
import { useToast } from "@/hooks/use-toast";

interface FormValues {
  email: string;
  password: string;
}

export default function SignIn() {
  const [formData, setFormData] = React.useState<FormValues>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveUser, setIsAuthenticated } = useGlobalContext();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await AUTH.PostLogin(formData);
      if (response.success) {
        saveUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        navigate("/dashboard");
        if (response.data.user.role === "admin") {
          toast({ description: response.message }); 
          navigate("/dashboard");
        } else {
          toast({ description: "You are not authorized to access this page" }); 
        }
      }
    } catch (error) {
      toast({ description: "An error occurred. Please try again." }); 
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="w-full max-w-md shadow-lg p-6 rounded-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email and password to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="**********"
                value={formData.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
