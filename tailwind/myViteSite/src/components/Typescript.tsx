import { useState } from 'react';

// 1. INTERFACES
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  isActive?: boolean;
}

// 2. TYPE ALIASES
type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
};

type Status = 'pending' | 'approved' | 'rejected';

// 4. GENERICS
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 7. ASYNC/AWAIT & PROMISES
async function fetchUserData(userId: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        isActive: true,
      });
    }, 1000);
  });
}

// 8. TYPE GUARDS
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    typeof (obj as User).id === 'number' &&
    typeof (obj as User).name === 'string'
  );
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export default function Typescript() {
  const [activeSection, setActiveSection] = useState<string>('interfaces');

  // Example data
  const sampleUser: User = {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'admin',
    isActive: true,
  };

  const products: Product[] = [
    { id: 'p1', title: 'Laptop', price: 999, category: 'Electronics' },
    { id: 'p2', title: 'Mouse', price: 29, category: 'Accessories' },
  ];

  const apiResponse: ApiResponse<User[]> = {
    data: [sampleUser],
    status: 200,
    message: 'Success',
  };

  const firstProduct = getFirstElement(products);
  const firstNumber = getFirstElement([1, 2, 3]);

  const statusExample: Status = 'pending';

  return (
    <main className="min-h-screen bg-gray-950 pt-8 pb-16">
      {/* Header */}
      <section className="pb-8 bg-gradient-to-r from-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            TypeScript Features Showcase
          </h1>
          <p className="text-lg text-gray-300">
            Comprehensive examples of TypeScript features used in this portfolio
          </p>
        </div>
      </section>

      {/* Navigation */}
      <section className="sticky top-16 z-40 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 py-3 overflow-x-auto">
            {[
              'interfaces',
              'types',
              'generics',
              'utilities',
              'async',
              'guards',
            ].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === section
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* 1. INTERFACES */}
        <section id="interfaces" className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-4">1. Interfaces</h2>
          <p className="text-gray-400 mb-6">
            Define the shape of objects with optional and required properties
          </p>

          <div className="space-y-4">
            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Code Example:</h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  isActive?: boolean; // Optional
}`}
              </pre>
            </div>

            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Live Example:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p className="font-semibold text-white mb-2">Sample User:</p>
                  <pre className="text-sm bg-gray-900 p-3 rounded">
{JSON.stringify(sampleUser, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">Properties:</p>
                  <ul className="space-y-1 text-sm">
                    <li>✓ id: {typeof sampleUser.id}</li>
                    <li>✓ name: {typeof sampleUser.name}</li>
                    <li>✓ email: {typeof sampleUser.email}</li>
                    <li>✓ role: {sampleUser.role}</li>
                    <li>✓ isActive: {String(sampleUser.isActive)}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. TYPE ALIASES */}
        <section id="types" className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-4">2. Type Aliases</h2>
          <p className="text-gray-400 mb-6">
            Create custom types including union types and object shapes
          </p>

          <div className="space-y-4">
            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Code Example:</h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
};

type Status = 'pending' | 'approved' | 'rejected';`}
              </pre>
            </div>

            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Live Example:</h3>
              
              <div className="mb-4 bg-gray-900 p-3 rounded">
                <p className="text-white mb-2">Union Type Example:</p>
                <p className="text-gray-300">Current Status: <span className="text-yellow-400 font-semibold">{statusExample}</span></p>
                <p className="text-gray-400 text-sm mt-1">Can only be: &apos;pending&apos; | &apos;approved&apos; | &apos;rejected&apos;</p>
              </div>

              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="bg-gray-900 p-3 rounded flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{product.title}</p>
                      <p className="text-gray-400 text-sm">{product.category}</p>
                    </div>
                    <p className="text-blue-400 font-bold">${product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. GENERICS */}
        <section id="generics" className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-4">3. Generics</h2>
          <p className="text-gray-400 mb-6">
            Create reusable components that work with any type
          </p>

          <div className="space-y-4">
            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Code Example:</h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}`}
              </pre>
            </div>

            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Live Example:</h3>
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded">
                  <p className="text-white font-semibold mb-2">Generic API Response&lt;User[]&gt;:</p>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
{JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded">
                    <p className="text-white font-semibold mb-2">getFirstElement&lt;Product&gt;:</p>
                    <p className="text-blue-400">{firstProduct?.title || 'undefined'}</p>
                    <p className="text-gray-400 text-sm mt-1">Type: Product | undefined</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded">
                    <p className="text-white font-semibold mb-2">getFirstElement&lt;number&gt;:</p>
                    <p className="text-blue-400">{firstNumber}</p>
                    <p className="text-gray-400 text-sm mt-1">Type: number | undefined</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. UTILITY TYPES */}
        <section id="utilities" className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-4">4. Utility Types</h2>
          <p className="text-gray-400 mb-6">
            Built-in TypeScript utilities for type transformations
          </p>

          <div className="bg-gray-950 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Available Utilities:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-green-400 font-bold mb-2">Readonly&lt;User&gt;</p>
                <p className="text-gray-300 mb-2">Makes all properties read-only</p>
                <code className="text-xs text-gray-400 block">
                  const user: Readonly&lt;User&gt; = ...
                  <br />user.name = &quot;new&quot; // Error!
                </code>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-green-400 font-bold mb-2">Partial&lt;User&gt;</p>
                <p className="text-gray-300 mb-2">Makes all properties optional</p>
                <code className="text-xs text-gray-400 block">
                  const update: Partial&lt;User&gt; = 
                  <br />{`{ name: "John" }`} // Valid!
                </code>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-green-400 font-bold mb-2">Pick&lt;User, &apos;id&apos; | &apos;name&apos;&gt;</p>
                <p className="text-gray-300 mb-2">Select specific properties</p>
                <code className="text-xs text-gray-400 block">
                  {`{ id: number; name: string }`}
                </code>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-green-400 font-bold mb-2">Omit&lt;User, &apos;email&apos;&gt;</p>
                <p className="text-gray-300 mb-2">Exclude specific properties</p>
                <code className="text-xs text-gray-400 block">
                  All User properties except email
                </code>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-green-400 font-bold mb-2">Record&lt;string, number&gt;</p>
                <p className="text-gray-300 mb-2">Object with string keys, number values</p>
                <code className="text-xs text-gray-400 block">
                  {`{ [key: string]: number }`}
                </code>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-green-400 font-bold mb-2">Required&lt;User&gt;</p>
                <p className="text-gray-300 mb-2">Makes all properties required</p>
                <code className="text-xs text-gray-400 block">
                  isActive becomes required
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* 7. ASYNC/AWAIT */}
        <section id="async" className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-4">5. Async/Await & Promises</h2>
          <p className="text-gray-400 mb-6">
            Handle asynchronous operations with type safety
          </p>

          <div className="space-y-4">
            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Code Example:</h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`async function fetchUserData(
  userId: number
): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        isActive: true,
      });
    }, 1000);
  });
}`}
              </pre>
            </div>

            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Try It:</h3>
              <button
                onClick={async () => {
                  const user = await fetchUserData(123);
                  alert(`✓ Fetched user: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 active:scale-95 transition-all duration-200"
              >
                Fetch User Data (async/await)
              </button>
              <p className="text-gray-400 text-sm mt-3">
                Click to simulate an API call with Promise and async/await
              </p>
            </div>
          </div>
        </section>

        {/* 8. TYPE GUARDS */}
        <section id="guards" className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-4">6. Type Guards</h2>
          <p className="text-gray-400 mb-6">
            Runtime type checking with TypeScript type narrowing
          </p>

          <div className="space-y-4">
            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Code Example:</h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    typeof (obj as User).id === 'number' &&
    typeof (obj as User).name === 'string'
  );
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}`}
              </pre>
            </div>

            <div className="bg-gray-950 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Live Example:</h3>
              <div className="space-y-3">
                <div className="bg-gray-900 p-3 rounded flex items-center justify-between">
                  <p className="text-white">isUser(sampleUser)</p>
                  <span className="text-green-400 font-bold">{String(isUser(sampleUser))}</span>
                </div>
                <div className="bg-gray-900 p-3 rounded flex items-center justify-between">
                  <p className="text-white">{`isUser({ id: 'wrong' })`}</p>
                  <span className="text-red-400 font-bold">{String(isUser({ id: 'wrong' }))}</span>
                </div>
                <div className="bg-gray-900 p-3 rounded flex items-center justify-between">
                  <p className="text-white">{`isString('hello')`}</p>
                  <span className="text-green-400 font-bold">{String(isString('hello'))}</span>
                </div>
                <div className="bg-gray-900 p-3 rounded flex items-center justify-between">
                  <p className="text-white">isString(123)</p>
                  <span className="text-red-400 font-bold">{String(isString(123))}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}