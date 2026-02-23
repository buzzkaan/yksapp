import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "#181838" }}
    >
      {/* Logo */}
      <div className="mb-8 text-center">
        <div
          className="font-[family-name:var(--font-pixel)] text-[14px] leading-relaxed tracking-wider"
          style={{ color: "#FFD000", textShadow: "2px 2px 0 #504000" }}
        >
          🌾 YKS FARM
        </div>
        <div
          className="font-[family-name:var(--font-body)] text-2xl mt-1"
          style={{ color: "#8890B8" }}
        >
          Çiftliğe Kayıt Ol
        </div>
      </div>

      {/* Clerk SignUp component */}
      <div
        className="border-4 p-1"
        style={{
          borderColor: "#4060D0",
          boxShadow: "4px 4px 0 0 #101010",
          background: "#E8E8F0",
        }}
      >
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#4060D0",
              colorBackground: "#E8E8F0",
              colorText: "#101010",
              colorTextSecondary: "#505050",
              colorInputBackground: "#FFFFFF",
              colorInputText: "#101010",
              borderRadius: "0px",
              fontFamily: "var(--font-vt323), monospace",
            },
            elements: {
              card: { boxShadow: "none", border: "none" },
              formButtonPrimary: {
                background: "#4060D0",
                border: "2px solid #0A3870",
                borderRadius: "0",
                boxShadow: "2px 2px 0 0 #101010",
                fontFamily: "var(--font-pixel), monospace",
                fontSize: "10px",
              },
              footerActionLink: { color: "#4060D0" },
            },
          }}
        />
      </div>
    </div>
  );
}
