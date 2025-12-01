import { useState, useEffect } from "react";
import ProductCard from "../components/my-comps/ProductCard";
import CartSidePanel from "../components/my-comps/CartSidePanel";
import { useCart } from "@/contexts/CartContext";
import { get_all_items } from "../utils/grocery_item";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import LineBreak from "../components/my-comps/Linebreak";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Navbar } from "@/components/ui/shadcn-io/navbar-08/Navbar";
import { GridPattern } from "@/components/ui/shadcn-io/grid-pattern";
import HomeIcon from "../components/my-comps/Home-Icon";
import Cart from "../components/my-comps/Cart";
import ShopIcon from "../components/my-comps/ShopIcon";
import Footer from "../components/my-comps/Footer";
import GithubIcon from "../components/my-comps/GithubIcon";
import { useAuth } from '../utils/AuthContext';
import { FileText } from "lucide-react";

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Local logout function
const handleLogoutLocal = (setUser: (user: null) => void) => {
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  setUser(null);
};

interface GroceryItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  brand: string;
  price?: number;
}

export default function Shop() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addItem } = useCart();

  const itemsPerPage = 20; 

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await get_all_items();
        
        // Function to get price for an item based on category
        const getPriceByCategory = (item: GroceryItem): number => {
          const category =
            typeof item.category === "string" ? item.category.toLowerCase() : "";
          const name = typeof item.name === "string" ? item.name.toLowerCase() : "";

          if (
            category.includes("fruit") ||
            name.includes("apple") ||
            name.includes("orange") ||
            name.includes("banana")
          ) {
            return Math.floor(Math.random() * 50) + 40; // ₹40-90
          } else if (category.includes("vegetable")) {
            return Math.floor(Math.random() * 40) + 30; // ₹30-70
          } else if (
            category.includes("dairy") ||
            name.includes("milk") ||
            name.includes("cheese")
          ) {
            return Math.floor(Math.random() * 60) + 50; // ₹50-110
          } else if (category.includes("snack") || name.includes("chips")) {
            return Math.floor(Math.random() * 30) + 20; // ₹20-50
          } else if (
            category.includes("beverage") ||
            name.includes("water") ||
            name.includes("juice")
          ) {
            return Math.floor(Math.random() * 40) + 25; // ₹25-65
          } else if (category.includes("bakery") || name.includes("bread")) {
            return Math.floor(Math.random() * 35) + 30; // ₹30-65
          } else {
            return Math.floor(Math.random() * 100) + 50; // ₹50-150
          }
        };

        // Fix double slashes in image URLs and assign permanent prices
        const fixedData = data.map((item: GroceryItem) => ({
          ...item,
          image: item.image.replace(/\/\//g, '/').replace('https:/', 'https://'),
          price: getPriceByCategory(item)
        }));
        setItems(fixedData.slice(0, 100)); // Get first 100 items
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  // Price mapping based on category (in Indian Rupees)
  // Note: Prices are now assigned during item fetch and stored with each item

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground text-xl">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userName={user?.displayName || user?.email?.split('@')[0] || 'User'}
        userEmail={user?.email || ''}
        userAvatar={user?.photoURL || undefined}
        onUserItemClick={handleUserItemClick}
        onUsernameChange={handleUsernameChange}
      />

      <GridPattern
        width={80}
        height={80}
        className="fixed inset-0 stroke-foreground/50 fill-foreground/20 mask-image:radial-gradient(400px_circle_at_center,white,transparent) "
        // className = "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        strokeDasharray="5 10"
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8 flex justify-center">
          <div className="inline-block bg-foreground/20 backdrop-blur-[5px] px-6 py-4 rounded-2xl">
            <h1 className="text-4xl font-bold text-border mb-2">
              <span className="text-border">
                Shop
              </span>
            </h1>
            <p className="text-foreground/70">
              Browse our collection of fresh groceries
            </p>
          </div>
        </div>

        <LineBreak style="dashed" />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-10">
          {currentItems.map((item) => (
            <div key={item.id} className="flex justify-center">
              <ProductCard
                title={item.name}
                description={
                  item.description ||
                  `Fresh ${item.name} from ${item.brand || "our store"}`
                }
                price={item.price || 0}
                image={item.image}
                onAddToCart={() => addItem({
                  id: item.id,
                  name: item.name,
                  price: item.price || 0,
                  image: item.image
                })}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination className="mb-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;

              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} />
      </div>

      <CartSidePanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <Footer />
    </div>
  );
}
