"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

//Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import LineBreak from "./Linebreak";
import LoginInfo from "./InfoHover";

//Routing
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

// Firebase auth error messages
const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};

//Props Structure for Sign-up and Log-in forms
interface FormProps {
  onNavigate: () => void;
}

function SignupForm({ onNavigate }: FormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password);
      toast.success("Account created successfully!");
      navigate("/home");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const errorMessage = getFirebaseErrorMessage(firebaseError.code || '');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-[100%] max-w-md rounded-none bg-card/90 backdrop-blur-[2.5px] p-4 md:rounded-2xl md:p-8 border-2 border-accent">
      <h2 className="text-xl font-bold text-foreground">
        Welcome to Gro-Story
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Demo account only
      </p>

      <form className="my-8 text-amber-950" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4 ">
          <Label htmlFor="signup-email">Email Address</Label>
          <Input
            id="signup-email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-primary font-medium text-primary-foreground shadow-[0px_1px_0px_0px_oklch(var(--primary-foreground)/.25)_inset,0px_-1px_0px_0px_oklch(var(--primary-foreground)/.25)_inset] disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign up"} &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </form>

      <div
        className="text-foreground text-center cursor-pointer hover:text-primary transition-colors"
        onClick={onNavigate}
      >
        Login
      </div>
    </div>
  );
}

function LoginForm({ onNavigate }: FormProps) {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const errorMessage = getFirebaseErrorMessage(firebaseError.code || '');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-[100%] max-w-md rounded-none bg-card/90 backdrop-blur-[2.5px] p-4 md:rounded-2xl md:p-8 border-2 border-accent">
      
      <div className="absolute right-8 ">
        <LoginInfo />
      </div>
      
      <h2 className="text-xl font-bold text-foreground">
        Welcome to Nature's Basket
      </h2>
      {/* <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Demo access
      </p> */}

      <br />
      <LineBreak></LineBreak>
      <br />

      <form className="my-8 text-amber-950" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4 ">
          <Label htmlFor="login-email">Email Address</Label>
          <Input
            id="login-email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-primary font-medium text-primary-foreground shadow-[0px_1px_0px_0px_oklch(var(--primary-foreground)/.25)_inset,0px_-1px_0px_0px_oklch(var(--primary-foreground)/.25)_inset] disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"} &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </form>

      <div
        className="text-foreground text-center cursor-pointer hover:text-border transition-colors"
        onClick={onNavigate}
      >
        Sign up
      </div>
    </div>
  );
}

function AboutMe({ onNavigate }: FormProps) {

  return (
    <div className="shadow-input mx-auto w-[100%] max-w-md rounded-none bg-card/90 backdrop-blur-[2.5px] p-4 md:rounded-2xl md:p-8 border-2 border-accent">
      <h1 className="text-3xl">Hi There!</h1>
      
      <br />
      <LineBreak />
      <br />

      <p>
        I am <span className="text-border">Zephyr</span>, and I like to code for fun.
        I am trying to learn React using Typescript and TailwindCSS, 
        and a couple of extra libraries such as animejs, motion, opentype to expand my knowledgebase.
      </p>
      
      <br />
      
      <p>
        This project is about an online grocery shopping website, <span className="text-border italic underline"> Nature's basket </span>
         that delivers groceries to your doorstep in a flash! Browse a catalogue of your favourite products,
        add them to the cart and check out, as simple as that!
      </p>

      <br />
      <p className="text-xs">
        (Be sure to check out my notes for extras :3)
      </p>

      <br />
      <LineBreak />
      <br />
      <p 
        className="text-center cursor-pointer hover:text-border"
        onClick={onNavigate}>
      Login
      
      </p>

    </div>
  )
}
//Login+Signup Carousel
export default function UserLogin() {
  //setting the api to scroll by clickng text
  const [api, setApi] = React.useState<CarouselApi>();

  // const goToAboutMe = () => {
  //   api?.scrollTo(0)
  // }

  const goToSignup = () => {
    api?.scrollTo(2);
  };

  const goToLogin = () => {
    api?.scrollTo(1);
  };

  return (
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem>
          <AboutMe onNavigate={goToLogin}/>
        
        </CarouselItem>
        <CarouselItem>
          {" "}
          <LoginForm onNavigate={goToSignup} />{" "}
        </CarouselItem>
        <CarouselItem>
          {" "}
          <SignupForm onNavigate={goToLogin} />{" "}
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}

//Extra Components
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
