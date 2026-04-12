```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables

-- Tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES users(id),
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tenant_id FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products(id)
);

-- RLS Policies

-- Tenants
CREATE POLICY "Tenants can only access their own data" ON tenants
FOR ALL
USING (id = auth.uid());

-- Users
CREATE POLICY "Users can only access their own data" ON users
FOR ALL
USING (tenant_id = auth.current_tenant_id());

-- Products
CREATE POLICY "Users can only access products from their tenant" ON products
FOR ALL
USING (tenant_id = auth.current_tenant_id());

-- Orders
CREATE POLICY "Users can only access orders from their tenant" ON orders
FOR ALL
USING (tenant_id = auth.current_tenant_id());

CREATE POLICY "Users can only access their own orders" ON orders
FOR ALL
USING (user_id = auth.uid());

-- Order Items
CREATE POLICY "Users can only access order items from their tenant" ON order_items
FOR ALL
USING (
  (SELECT tenant_id FROM orders WHERE id = order_items.order_id) = auth.current_tenant_id()
);

-- TypeScript Types

// Tenants
interface Tenant {
  id: string;
  name: string;
  created_at: string;
}

// Users
interface User {
  id: string;
  tenant_id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

// Products
interface Product {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
}

// Orders
interface Order {
  id: string;
  tenant_id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

// Order Items
interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}
```