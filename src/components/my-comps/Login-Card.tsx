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

//Routing
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

// Guest credentials
const GUEST_EMAIL = 'guest@email.com';
const GUEST_PASSWORD = 'password';

// Verification logic
const verifyCredentials = (email: string, password: string): { valid: boolean; error?: string } => {
  if (email === GUEST_EMAIL && password === GUEST_PASSWORD) {
    return { valid: true };
  }
  return { valid: false, error: 'Invalid credentials. Use guest@email.com / password' };
};

//Props Structure for Sign-up and Log-in forms
interface FormProps {
  onNavigate: () => void;
}

function SignupForm({ onNavigate }: FormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    const verification = verifyCredentials(email, password);
    
    if (verification.valid) {
      const user = {
        uid: 'guest-user',
        email: GUEST_EMAIL,
        displayName: 'Guest User'
      };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      toast.success("Logged in successfully!");
      navigate("/home");
    } else {
      console.error("Login failed", verification.error);
      toast.error(verification.error || "Invalid credentials");
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
          className="group/btn relative block h-10 w-full rounded-md bg-primary font-medium text-primary-foreground shadow-[0px_1px_0px_0px_oklch(var(--primary-foreground)/.25)_inset,0px_-1px_0px_0px_oklch(var(--primary-foreground)/.25)_inset]"
          type="submit"
        >
          Continue &rarr;
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
  const { setUser } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    const verification = verifyCredentials(email, password);
    
    if (verification.valid) {
      const user = {
        uid: 'guest-user',
        email: GUEST_EMAIL,
        displayName: 'Guest User'
      };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      toast.success("Login successful!");
      navigate("/home");
    } else {
      console.error("Login failed", verification.error);
      toast.error(verification.error || "Invalid credentials");
    }
  };

  return (
    <div className="shadow-input mx-auto w-[100%] max-w-md rounded-none bg-card/90 backdrop-blur-[2.5px] p-4 md:rounded-2xl md:p-8 border-2 border-accent">
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
          className="group/btn relative block h-10 w-full rounded-md bg-primary font-medium text-primary-foreground shadow-[0px_1px_0px_0px_oklch(var(--primary-foreground)/.25)_inset,0px_-1px_0px_0px_oklch(var(--primary-foreground)/.25)_inset]"
          type="submit"
        >
          Login &rarr;
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

  const goToAboutMe = () => {
    api?.scrollTo(0)
  }

  // const goToSignup = () => {
  //   api?.scrollTo(1);
  // };

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
          <LoginForm onNavigate={goToAboutMe} />{" "}
        </CarouselItem>
        {/* <CarouselItem>
          {" "}
          <SignupForm onNavigate={goToLogin} />{" "}
        </CarouselItem> */}
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
