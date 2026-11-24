CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(150) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" varchar(200) NOT NULL,
	"client_email" varchar(254) NOT NULL,
	"client_phone" varchar(30) NOT NULL,
	"service_id" integer,
	"event_type" varchar(200) NOT NULL,
	"event_date" date NOT NULL,
	"event_time" time,
	"event_location" varchar(300) NOT NULL,
	"guest_count" integer DEFAULT 1 NOT NULL,
	"special_requests" text DEFAULT '' NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"quoted_price" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_spots" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" varchar(500) NOT NULL,
	"title" varchar(200) DEFAULT '' NOT NULL,
	"span" varchar(10) DEFAULT 'normal' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" varchar(500) NOT NULL,
	"caption" varchar(200) DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"category_id" integer NOT NULL,
	"image" varchar(500) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"price_from" numeric(10, 2) NOT NULL,
	"duration" varchar(100) NOT NULL,
	"includes" text DEFAULT '' NOT NULL,
	"cover_image" varchar(500),
	"icon" varchar(50) DEFAULT 'camera' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" varchar(100) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"photo" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bookings_created_idx" ON "bookings" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "photos_category_idx" ON "photos" USING btree ("category_id");