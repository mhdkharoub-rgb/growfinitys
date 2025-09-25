import { parse } from "cookie";

export default function Dashboard({ plan }) {
  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
          <p>Please sign up or purchase a plan to access this content.</p>
          <a href="/#pricing" className="btn-gold mt-6 inline-block">
            View Plans
          </a>
        </div>
      </div>
    );
  }

  // Master "LATEST" links
  const driveLinks = {
    free: "https://drive.google.com/drive/folders/1A8G_SdZTCPVABZEFlQzfcIZcQi9iE-IL?usp=drive_link",
    basic: "https://drive.google.com/drive/folders/1wTRvUa-G1jO16ubXCeZdnAKzEmRnzPNG?usp=drive_link",
    pro: "https://drive.google.com/drive/folders/1_vBFkULww1XPkNF4Xv2xbA3xWuHfVkov?usp=drive_link",
    vip: "https://drive.google.com/drive/folders/1NZbIvMtXKqRSSONawdqRFfzQjRHMvNzy?usp=drive_link",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold mb-6">🎉 Welcome to Growfinitys Dashboard</h1>
        <p className="mb-6">You’re currently on the <strong>{plan.toUpperCase()}</strong> plan.</p>

        {driveLinks[plan] ? (
          <a
            href={driveLinks[plan]}
            className="btn-gold"
            target="_blank"
            rel="noreferrer"
          >
            📥 Access Latest Pack
          </a>
        ) : (
          <p>No content assigned for this plan yet.</p>
        )}
      </div>
    </div>
  );
}

// --- Server-side cookie check ---
export async function getServerSideProps(context) {
  const { req, query } = context;
  let plan = null;

  if (query.plan) {
    plan = query.plan;
    context.res.setHeader(
      "Set-Cookie",
      `growfinitys_plan=${plan}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`
    );
  } else if (req.headers.cookie) {
    const cookies = parse(req.headers.cookie);
    if (cookies.growfinitys_plan) {
      plan = cookies.growfinitys_plan;
    }
  }

  return { props: { plan: plan || null } };
}
