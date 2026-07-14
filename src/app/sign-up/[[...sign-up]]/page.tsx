import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      <div className="relative z-10 w-full max-w-md mx-auto p-4 flex flex-col items-center">
        {/* Logo/Brand Header */}
        <div className="mb-8 text-center">
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            BookStore
          </div>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Create an account to build your library and save your favorites.
          </p>
        </div>

        {/* Clerk Sign Up Card */}
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#4f46e5",
              colorBackground: "#ffffff",
            },
            elements: {
              card: "shadow-lg border border-slate-200 bg-white rounded-2xl",
              headerTitle: "text-2xl font-bold text-slate-900",
              headerSubtitle: "text-slate-500",
              socialButtonsBlockButton: "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 transition-all",
              formButtonPrimary: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm border border-slate-950 font-semibold cursor-pointer",
              footerActionLink: "text-indigo-650 hover:text-indigo-750 font-bold",
              dividerLine: "bg-slate-200",
              dividerText: "text-slate-400",
              formFieldLabel: "text-slate-700 font-medium",
              formFieldInput: "border-slate-200 focus:border-slate-400 bg-white text-slate-900",
              footer: "bg-white",
            },
          }}
        />
      </div>
    </div>
  )
}
