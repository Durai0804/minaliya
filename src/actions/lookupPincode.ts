"use server";

export async function lookupPincode(pincode: string) {
  try {
    const clean = pincode.replace(/\s/g, "");
    if (!/^\d{6}$/.test(clean)) {
      return { success: false, error: "Invalid pincode format." };
    }

    const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return { success: false, error: "Pincode lookup service unavailable." };
    }

    const data = await res.json();
    const postOffice = data?.[0]?.PostOffice?.[0];

    if (!postOffice?.State) {
      return { success: false, error: "Could not find state for this pincode." };
    }

    return { success: true, state: postOffice.State as string };
  } catch {
    return { success: false, error: "Failed to look up pincode." };
  }
}
