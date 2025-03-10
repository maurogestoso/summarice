import { SignOutButton } from "@clerk/react-router";
import type { Route } from "./+types/account";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Account" },
    { name: "description", content: "Manage your account" },
  ];
}

export default function AccountPage() {
  return (
    <>
      <nav className="mb-4">
        <a href="/recipes" className="link link-secondary">
          {"<- Back to recipes"}
        </a>
      </nav>
      <h2 className="font-bold text-2xl mb-4">Account</h2>
      <div className="flex flex-col gap-4">
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">Sign Out</h3>
            <p className="text-sm opacity-70">Sign out of your account</p>
            <div className="card-actions justify-end">
              <SignOutButton>
                <button className="btn btn-primary">Sign Out</button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 