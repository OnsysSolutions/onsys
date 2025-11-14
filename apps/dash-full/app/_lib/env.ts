export const env = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
    AUTH_SECRET: process.env.AUTH_SECRET as string,

    ADMIN_USER_PASS: process.env.ADMIN_USER_PASS as string,

    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID as string,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET as string,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,

    RESEND_API_KEY: process.env.RESEND_API_KEY as string,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN as string,
    BLOB_BASE_URL: process.env.BLOB_BASE_URL as string,
    ONSYS_API_URL: process.env.ONSYS_API_URL as string,

    DATABASE_URL: process.env.DATABASE_URL as string,
    DIRECT_URL: process.env.DIRECT_URL as string,
    SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL as string
}
