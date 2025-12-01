//components
import { GridPattern } from "@/components/ui/shadcn-io/grid-pattern";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Navbar } from "@/components/ui/shadcn-io/navbar-08/Navbar";
import SVG from "@/components/ui/svg-comp";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import  LineBreak  from "@/components/my-comps/Linebreak";
import Footer from "@/components/my-comps/Footer";

//icons
import HomeIcon from "@/components/my-comps/Home-Icon";
import Cart from "@/components/my-comps/Cart";
import ShopIcon from "@/components/my-comps/ShopIcon";
import GithubIcon from "@/components/my-comps/GithubIcon";
import CartSidePanel from "@/components/my-comps/CartSidePanel";
import { FileText } from "lucide-react";

//images
import groceryImage from "@/assets/images/grocery.jpg";
import appleImage from "@/assets/images/apple.jpg";
import orangeImage from "@/assets/images/orange.jpg";

//functions and hooks
import { useState, useEffect } from "react";
// import { useCart } from "@/contexts/CartContext";
import { get_item_by_name} from '../utils/grocery_item';
import { useAuth } from '../utils/AuthContext';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Local logout function
const handleLogoutLocal = (setUser: (user: null) => void) => {
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  setUser(null);
};

export default function Home() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [groceryItems, setGroceryItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch grocery items and process images
  useEffect(() => {
    async function fetchItems() {
      try {
        // Define search terms
        const searchTerms = ["apple", "orange", "banana", "strawberry", "avocado", "flour", "water", "chips"];
        
        // Fetch all items in parallel using Promise.all
        const results = await Promise.all(
          searchTerms.map(term => get_item_by_name(term))
        );
        
        // Get first match from each result and filter out nulls
        const fetchedItems = results
          .map(result => result[0])
          .filter(item => item);
        
        // Use items as-is without background removal processing
        const processedItems = fetchedItems.map(item => ({
          title: item.name,
          src: item.image,
          description: item.description
        }));
        
        console.log("Processed items:", processedItems);
        setGroceryItems(processedItems);
      } catch (error) {
        console.error("Failed to fetch grocery items:", error);
        // Fallback to local images
        setGroceryItems([
          { title: "Apple", src: appleImage },
          { title: "Orange", src: orangeImage }
        ]);
      }
    }

    fetchItems();
    
    // Cleanup: revoke object URLs when component unmounts
    return () => {
      groceryItems.forEach(item => {
        if (item.src.startsWith('blob:')) {
          URL.revokeObjectURL(item.src);
        }
      });
    };
  }, []);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleLogout = () => {
    try {
      handleLogoutLocal(setUser);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  const handleUsernameChange = (newName: string) => {
    if (user) {
      // Update local user state with new display name
      const updatedUser = { ...user, displayName: newName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Username updated successfully');
    }
  };

  const handleUserItemClick = (item: string) => {
    if (item === 'logout') {
      handleLogout();
    }
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
    <div className="w-full relative min-h-screen bg-background  ">
      <Navbar 
        userName={user?.displayName || user?.email?.split('@')[0] || 'User'}
        userEmail={user?.email || ''}
        userAvatar={user?.photoURL || undefined}
        onUserItemClick={handleUserItemClick}
        onUsernameChange={handleUsernameChange}
      />

      {/* Sticky Background */}
      <GridPattern
        width={80}
        height={80}
        className="fixed inset-0 stroke-foreground/50 fill-foreground/20 mask-image:radial-gradient(400px_circle_at_center,white,transparent) "
        // className = "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        strokeDasharray="5 10"
      />

      {/* Scrollable layer content is down from here */}
      <div className="relative flex min-h-screen w-full items-center justify-center p-20">



        {/* SVG ELEMENTS */}
        <SVG
          svgName="Flower-1"
          scale="300"
          className="absolute top-20 left-20 animate-spin-slow-5"
        />

        <SVG 
          svgName="Star-3" 
          scale="200" 
          className="absolute rotate-33 top-135 left-165 text-border"
        />

        <SVG
          svgName="Flower-3"
          scale="130"
          className="absolute top-300 -right-10 text-border rotate-90 z-10"
        />

        <SVG
          svgName="Flower-3"
          scale="200"
          className="absolute top-270 -right-10 rotate-33 z-5"
        />

        
        <SVG
          svgName="Flower-3"
          scale="250"
          className="absolute top-290 right-2 rotate-46 text-chart-3"
        />

        <SVG svgName="Flower-5" scale="350" className="absolute left-2 top-270"/>


        {/* Text Content */}
        <div className="absolute top-40 left-40 h-screen w-[35%] backdrop-blur-[4px] bg-background/15 pr-[25px] pl-[25px] pt-[15px]">
          <h1 className="text-border text-8xl font-[OnelySans]">Nature's Basket</h1>

          <br />
          <br />
          <br />
          <br />

          <p className="text-foreground text-l font-[JetBrains]">
            Welcome to Nature's Basket, your all-in-one destination for fast,
            easy, and reliable online grocery shopping. From fresh fruits and
            vegetables to snacks, beverages, and household essentials -
            everything you need is just a few clicks away.
          </p>

          <br />
          <br />

          <p className="text-foreground text-l font-[JetBrains]">
            We understand that your time is valuable, which is why we&apos;ve
            made shopping effortless. Simply browse, order, and relax while we
            deliver your groceries right to your doorstep — fresh, on time, and
            hassle-free.
          </p>

          <br />
          <br />

          <p className="text-foreground text-l font-[JetBrains]">
            At Nature's Basket, we combine quality, convenience, and
            affordability to bring you the best grocery experience possible. Say
            goodbye to crowded stores and long queues — and hello to smarter
            shopping from the comfort of your home.
          </p>


          <div className="w-full mt-8">
            <SVG svgName="Checkered-1" scale="160px" className="text-border absolute bottom-2 left-0"></SVG>
            <SVG svgName="Checkered-1" scale="160px" className="text-border absolute bottom-2 left-45"></SVG>
            <SVG svgName="Checkered-1" scale="160px" className="text-border absolute bottom-2 left-90"></SVG>
            <SVG svgName="Checkered-1" scale="160px" className="text-border absolute bottom-2 left-115"></SVG>
            <SVG svgName="Checkered-1" scale="160px" className="text-border absolute bottom-2 left-640"></SVG>
          </div>
        </div>

        {/* Image beside text content */}
        <img
          src={groceryImage}
          alt="Grocery image"
          className="absolute h-screen w-auto top-40 right-40 rounded-3xl ring-2 ring-border ring-offset-8 ring-offset-background z-10"
        />

        <br />
        <br />

      </div>
      
      {/* Featured Section */}
      <div className="relative w-full py-20 mt-50 ">
        <LineBreak/>

        <h1 className="text-4xl text-center mb-10 mt-15 font-[OnelySans]">
          <span className="text-border bg-foreground/10 px-4 py-2 rounded-2xl backdrop-blur-[5px]">Featured products</span>
        </h1>        
        
        <Carousel cards={groceryItems} />

      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} />
      </div>

      <CartSidePanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    <Footer />

    </div>
  );
}
