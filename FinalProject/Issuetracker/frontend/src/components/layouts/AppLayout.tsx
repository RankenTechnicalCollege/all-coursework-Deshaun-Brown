import { Outlet } from "react-router-dom";
import { Navbar1 } from "@/components/navbar1";
import { Footer2 } from "@/components/footer2";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar1 
        logo={{
          url: "/",
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
          alt: "Issue Tracker",
          title: "My Issue Tracker"
        }}
        menu={[
          { title: "Home", url: "/" },
          { title: "Users", url: "/users" },
          { title: "Bugs", url: "/bugs" }
        ]}
        auth={{
          login: { title: "Login", url: "/login" },
          signup: { title: "Sign up", url: "/signup" }
        }}
      />
      <main className="flex-1 container mx-auto py-8">
        <Outlet />
      </main>
      <Footer2 
        logo={{
          url: "/",
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
          alt: "Issue Tracker",
          title: "My Issue Tracker"
        }}
        menuItems={[
          {
            title: "Roles",
            links: [
              { text: "Developer", url: "/users?role=developer",},
              { text: "QA", url: "/users?role=qa", },
              { text: "Business Analyst", url: "/users?role=business%20analyst",  },
              { text: "Product Manager", url: "/users?role=product-manager",  },
              { text: "Technical Manager", url: "/users?role=technical%20manager",  }
            ]
          }
        ]}
        bottomLinks={[
          { text: "©2025 DeSean Brown", url: "#" }
        ]}
      />
    </div>
  );
}

export default AppLayout;