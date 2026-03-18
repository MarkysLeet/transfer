import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export async function getIsMobile(): Promise<boolean> {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  const parser = new UAParser(userAgent);
  const deviceType = parser.getDevice().type;

  // Considering tablet and mobile as "mobile" layout for this context,
  // or specifically only mobile if we strictly want >=1024px for desktop.
  // iPad is usually 'tablet'.
  // We'll treat 'mobile' and 'tablet' as mobile fallback to be safe,
  // desktop returns undefined from getDevice().type.
  return deviceType === 'mobile' || deviceType === 'tablet';
}
