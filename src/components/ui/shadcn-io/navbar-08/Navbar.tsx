'use client';

import * as React from 'react';
import { useEffect, useState, useRef, useId } from 'react';
import { SearchIcon, MoonIcon, SunIcon, UserIcon, ChevronDownIcon, Edit2Icon, CheckIcon, XIcon } from 'lucide-react';
import { Button } from '../../button';
import { Input } from '../../input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../../navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar';
import { Badge } from '../../badge';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

import SVG from '../../svg-comp';

// Simple logo component for the navbar
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <SVG svgName='Star-3' scale='35px' className='text-border'/>
  );
};

// Hamburger icon component
const HamburgerIcon = ({ className, ...props }: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn('pointer-events-none', className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);

// Theme Toggle Component
const ThemeToggle = ({ 
  onToggle 
}: { 
  onToggle?: () => void;
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    if (onToggle) onToggle();
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-9 w-9" 
      onClick={toggleTheme}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

// User Menu Component
const UserMenu = ({
  userName = 'John Doe',
  userEmail = 'john@example.com',
  userAvatar,
  onItemClick,
  onUsernameChange
}: {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onItemClick?: (item: string) => void;
  onUsernameChange?: (newName: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userName);

  const handleSave = () => {
    if (editedName.trim() && editedName !== userName) {
      onUsernameChange?.(editedName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(userName);
    setIsEditing(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground">
          <Avatar className="h-7 w-7">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="text-xs">
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon className="h-3 w-3 ml-1" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="h-7 text-sm"
                  placeholder="Enter username"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleSave}
                >
                  <CheckIcon className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleCancel}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2Icon className="h-3 w-3" />
                </Button>
              </div>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onItemClick?.('logout')}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Types
export interface Navbar08NavItem {
  href?: string;
  label: string;
  active?: boolean;
}

export interface Navbar08Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar08NavItem[];
  searchPlaceholder?: string;
  searchShortcut?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onNavItemClick?: (href: string) => void;
  onSearchSubmit?: (query: string) => void;
  onThemeToggle?: () => void;
  onUserItemClick?: (item: string) => void;
  onUsernameChange?: (newName: string) => void;
}

// Default navigation links
const defaultNavigationLinks: Navbar08NavItem[] = [
  { href: '#', label: 'Home', active: true },
  { href: '#', label: 'Features' },
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'About' },
];

export const Navbar = React.forwardRef<HTMLElement, Navbar08Props>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = '#',
      navigationLinks = defaultNavigationLinks,
      searchPlaceholder = 'Search...',
      searchShortcut = '⌘K',
      userName = 'John Doe',
      userEmail = 'john@example.com',
      userAvatar,
      onNavItemClick,
      onSearchSubmit,
      onThemeToggle,
      onUserItemClick,
      onUsernameChange,
      ...props
    },
    ref
  ) => {
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const searchId = useId();

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const query = formData.get('search') as string;
      if (onSearchSubmit) {
        onSearchSubmit(query);
      }
    };

    return (
      <header
        ref={combinedRef}
        className={cn(
          'fixed top-0 z-50 w-full border-b bg-background/30 backdrop-blur-md px-4 md:px-6 [&_*]:no-underline',
          className
        )}
        {...props}
      >
        <div className="container mx-auto max-w-screen-2xl">
          {/* Top section */}
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left side */}
            <div className="flex flex-1 items-center gap-2">
              {/* Mobile menu trigger */}
              {isMobile && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="group h-8 w-8 hover:bg-accent hover:text-accent-foreground"
                      variant="ghost"
                      size="icon"
                    >
                      <HamburgerIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-64 p-1">
                    <NavigationMenu className="max-w-none">
                      <NavigationMenuList className="flex-col items-start gap-0">
                        {navigationLinks.map((link, index) => (
                          <NavigationMenuItem key={index} className="w-full">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (onNavItemClick && link.href) onNavItemClick(link.href);
                              }}
                              className={cn(
                                'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline',
                                link.active && 'bg-accent text-accent-foreground'
                              )}
                            >
                              {link.label}
                            </button>
                          </NavigationMenuItem>
                        ))}
                      </NavigationMenuList>
                    </NavigationMenu>
                  </PopoverContent>
                </Popover>
              )}
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
                >
                  <div className="text-2xl">
                    {logo}
                  </div>
                  <span className="hidden font-bold text-3xl sm:inline-block text-foreground ">Nature's Basket</span>
                </button>
              </div>
            </div>
            {/* Middle area */}
            <div className="grow">
              {/* Search form */}
              <form onSubmit={handleSearchSubmit} className="relative mx-auto w-full max-w-xs">
                <Input
                  id={searchId}
                  name="search"
                  className="peer h-8 ps-8 pe-10"
                  placeholder={searchPlaceholder}
                  type="search"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
                  <kbd className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {searchShortcut}
                  </kbd>
                </div>
              </form>
            </div>
            {/* Right side */}
            <div className="flex flex-1 items-center justify-end gap-2">
              {/* Theme Toggle */}
              <ThemeToggle 
                onToggle={onThemeToggle}
              />
              {/* User menu */}
              <UserMenu 
                userName={userName}
                userEmail={userEmail}
                userAvatar={userAvatar}
                onItemClick={onUserItemClick}
                onUsernameChange={onUsernameChange}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Navbar.displayName = 'Navbar08';

export { Logo, HamburgerIcon, ThemeToggle, UserMenu };