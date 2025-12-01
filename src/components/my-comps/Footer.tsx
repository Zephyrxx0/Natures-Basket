import AnimatedText from "./AnimatedText";
import { Separator } from "@/components/ui/separator";
import SVG from "../ui/svg-comp";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-foreground text-background relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Animated Logo Section */}
                <div className="flex justify-center mb-12">
                    <AnimatedText 
                        text="Zephyr"
                        className="text-border"
                        fontSize={80}
                        strokeWidth={3}
                        duration={3}
                        loop={true}
                    />
                </div>


                <Separator className="mb-8" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-border">About Us</h3>
                        <p className="text-sm text-background/80">
                            Fresh groceries delivered to your doorstep. Quality products, affordable prices, and exceptional service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-border">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="text-background/80 hover:text-border transition-colors">Home</a></li>
                            <li><a href="/shop" className="text-background/80 hover:text-border transition-colors">Shop</a></li>
                            <li><a href="#" className="text-background/80 hover:text-border transition-colors">About</a></li>
                            <li><a href="#" className="text-background/80 hover:text-border transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-border">Customer Service</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-background/80 hover:text-border transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-background/80 hover:text-border transition-colors">Track Order</a></li>
                            <li><a href="#" className="text-background/80 hover:text-border transition-colors">Returns</a></li>
                            <li><a href="#" className="text-background/80 hover:text-border transition-colors">Shipping Info</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-border">Contact</h3>
                        <ul className="space-y-2 text-sm text-background/80">
                            <li>Email: support@naturesbasket.com</li>
                            <li>Phone: +91 1800-123-4567</li>
                            <li>Address: Nagpur, India</li>
                        </ul>
                    </div>
                </div>

                <Separator className="mb-6" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
                    <p>© {currentYear} Nature's Basket. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-border transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-border transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-border transition-colors">Cookies</a>
                    </div>
                </div>
            </div>

            <SVG svgName="Flower-4" scale="150px" className="absolute top-4 left-4 animate-spin-slow-1"/>
        </footer>
    )
}

