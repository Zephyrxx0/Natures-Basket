import { useState } from "react";

import { GridPattern } from "@/components/ui/shadcn-io/grid-pattern";
import { FloatingDock } from "@/components/ui/floating-dock";
import CartSidePanel from "@/components/my-comps/CartSidePanel"; 
import HomeIcon from "@/components/my-comps/Home-Icon";
import ShopIcon from "@/components/my-comps/ShopIcon";
import Cart from "@/components/my-comps/Cart";
import GithubIcon from "@/components/my-comps/GithubIcon";
import { FileText } from "lucide-react";


export default function Notes() {

    const [isCartOpen, setIsCartOpen] = useState(false);
    

    const handleCartClick = () => {
    setIsCartOpen(true);
  };

      const dockItems = [
    {
      title: "Home",
      icon: <HomeIcon />,
      href: "/",
    },

    {
      title: "Shop",
      icon: <ShopIcon />,
      href: "/shop",
    },
    {
      title: "Cart",
      icon: <Cart />,
      href: "#",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        handleCartClick();
      },
    },
    {
        title: "Github",
        icon: <GithubIcon />,
        href: "https://github.com/Zephyrxx0"
    },
        {
      title : "Notes",
      icon: <FileText size={24} />,
      href: "/notes"
    }
  ];

    return (
        <div className="min-h-screen bg-background">
            <GridPattern
                width={80}
                height={80}
                className="fixed inset-0 stroke-foreground/50 fill-foreground/20 mask-image:radial-gradient(400px_circle_at_center,white,transparent) "
                // className = "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
                strokeDasharray="5 10"
            />

            <div className="text-4xl">
                Notes
            </div>
            <br />
            <br />
            <div className="italics">
                to be done...
            </div>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                <FloatingDock items={dockItems} />
            </div>   

            <CartSidePanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            

        </div>
    );
}
