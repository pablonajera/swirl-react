# swirl-react

Swirl React is a collection of custom React hooks designed to simplify API requests and enhance data fetching in your React applications.

These hooks provide an elegant and efficient way to perform HTTP requests using various HTTP methods, such as `GET`, `POST`, `PATCH`, `PUT`, and `DELETE`. Each hook encapsulates the logic required for making the respective request, managing loading states, handling errors, and optionally caching responses.

The `useGet` hook is designed to follow the SWR (stale while revalidating) pattern, which is a popular strategy for data fetching in React applications. This pattern ensures that data is served from a local cache (stale) while simultaneously making a new request to the server (revalidating) to fetch the latest data. The 'swirl' concept derives its name from a playful extension of SWR to SWRL and then to swirl, reflecting the library's intention to provide a seamless and efficient approach to data fetching and management, mirroring the familiar SWR pattern.

## Table of Contents

- [swirl-react](#swirl-react)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [useGet](#useget)
      - [Parameters](#parameters)
      - [Output](#output)
      - [Simple sample](#simple-sample)
      - [Sample with parameters](#sample-with-parameters)
    - [usePost](#usepost)
      - [Parameters](#parameters-1)
      - [Output](#output-1)
      - [Sample](#sample)
    - [usePatch](#usepatch)
      - [Parameters](#parameters-2)
      - [Output](#output-2)
    - [usePut](#useput)
      - [Parameters](#parameters-3)
      - [Output](#output-3)
    - [useDelete](#usedelete)
      - [Parameters](#parameters-4)
      - [Output](#output-4)
  - [Options](#options)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

You can install `swirl-react` using npm or yarn:

```bash
npm install swirl-react
```

```bash
yarn add swirl-react
```

## Usage

### useGet

The `useGet` hook allows you to perform GET requests and manage the corresponding data, loading state, errors, and caching. It's particularly useful for fetching data from a remote API endpoint.

It facilitates data fetching through the GET HTTP method while embracing the SWR (stale while revalidating) pattern. This pattern, also known as the 'swirl' approach, ensures an optimal balance between immediate data display and fetching the most up-to-date information from the server.


#### Parameters

Note that these are all optional. Use them as needed.

| Parameter          | Type    | Description                                 | Default            |
| ------------------ | ------- | ------------------------------------------- | ------------------ |
| `url`              | string  | The URL to fetch data from.                 | -                  |
| `options`          | object  | Additional [options](#options) for the request.         | -                  |
| `parameters`       | object  | Query parameters for the request URL.       | `null`             |
| `disableCache`     | boolean | Disable caching of the response.            | `false`            |
| `throttleInterval` | number  | Throttle interval for consecutive requests. | `2000` (2 seconds) |
| `options`          | object  | Additional fetch request options.           | `{}`               |

#### Output

The `useGet` hook returns an object with the following properties:

| Property     | Type                   | Description                                                                       |
| ------------ | ---------------------- | --------------------------------------------------------------------------------- |
| `data`       | `T \| null`            | The fetched data or `null` if no data has been fetched yet.                       |
| `isLoading`  | `boolean`              | A boolean indicating whether the request is currently loading.                    |
| `error`      | `RequestError \| null` | An error object if the request encounters an error, otherwise `null`.             |
| `statusCode` | `number \| null`       | The HTTP status code of the response, or `null` if no response has been received. |
| `trigger`    | `function`             | A function to manually trigger the GET request.                                   |


#### Simple sample
Assuming you have an API endpoint that returns the following:

```json
{
  "id": 1,
  "title": "Today was a good day",
  "body": "I woke up early and had a great breakfast."
}
```

You can use swirl to fetch the data as follows:

```jsx
import React from 'react';
import { useGet } from 'swirl-react';

export default function PostsPage() {
  // Define the URL for the GET request
  const apiUrl = 'https://api.example.com/posts/1';

  // Use the useGet hook to fetch data
  const { data, isLoading, error, statusCode, trigger } = useGet(apiUrl);

  return (
    <div>
      <h1>Posts</h1>

      {/* Loading state */}
      {isLoading && <p>Loading...</p>}

      {/* Error state */}
      {error && <p>Error: {error.message}</p>}

      {/* Success state */}
      {data && (
        <div>
          {/* Use trigger function to re-launch the request */}
          <button onClick={trigger}>Refresh Posts</button>

          {/* Display fetched data */}
          <h2>{data.title}</h2>
          <p>{data.body}</p>

          {/* Display status code */}
          {statusCode && <p>Status Code: {statusCode}</p>}
        </div>
      )}
    </div>
  );
}
```

#### Sample with parameters
```jsx
import React from 'react';
import { useGet } from 'swirl-react';

export default function PostsPageWithParameters() {
  // Define the URL for the GET request
  const apiUrl = 'https://api.example.com/posts';

  // Use the useGet hook to fetch data with parameters
  const { data, isLoading, error, statusCode, trigger } = useGet(apiUrl, {
    // Optionally define query parameters
    parameters: {
      category: 'technology',
      limit: 10,
    },
    // Optionally define additional fetch options
    options: {
      {
        headers: {
        Authorization: 'Bearer your_access_token',
      },
      credentials: 'include',
    }
    }
  });

  // ... use in template
}

```
In this example, the `data`, `isLoading`, and `error` states are used to conditionally render different content based on the state of the request:

- If `isLoading` is true, it displays a "Loading..." message.
- If `error` is not null, it displays an error message with the error details.
- If `data` is not null, it displays the fetched data along with a button to manually trigger a refresh and the HTTP status code of the response.

### usePost

The `usePost` hook allows you to perform POST requests and manage the corresponding data sending, loading state, errors, and more. It's particularly useful for sending data to a remote API endpoint.

#### Parameters

| Parameter    | Type     | Description                           | Default |
| ------------ | -------- | ------------------------------------- | ------- |
| `url`        | `string` | The URL to send the POST request to.  | -       |
| `body`       | `any`    | The data to send in the request body. | -       |
| `parameters` | `object` | Query parameters for the request URL. | `{}`    |
| `options`    | `object` | Additional [options](#options) for the request.   | `{}`    |


#### Output

The `usePost` hook returns an object with the following properties:

| Property     | Type                   | Description                                                                       |
| ------------ | ---------------------- | --------------------------------------------------------------------------------- |
| `data`       | `T \| null`            | The response data or `null` if no data has been received yet.                     |
| `isLoading`  | `boolean`              | A boolean indicating whether the request is currently loading.                    |
| `error`      | `RequestError \| null` | An error object if the request encounters an error, otherwise `null`.             |
| `statusCode` | `number \| null`       | The HTTP status code of the response, or `null` if no response has been received. |
| `sendData`   | `function`             | A function that can be called to manually trigger the POST request with new data. |

#### Sample
```jsx
import React, { useState } from 'react';
import { usePost } from 'swirl-react';

export default function CreatePostPage() {
  // State for input fields
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Use the usePost hook to send the POST request
  const { data, isLoading, error, statusCode, trigger } = usePost({
    // Define the URL for the POST request
    url: 'https://api.example.com/posts',
    // Define the request POST body
    body: {
      title,
      body
    },
  });

  return (
    <div>
      <h1>Create Post</h1>

      {/* Display loading state */}
      {isLoading && <p>Sending...</p>}

      {/* Display error state */}
      {error && <p>Error: {error.message}</p>}

      {/* Display success state */}
      {data && (
        <div>
          <p>Post created successfully!</p>
          <p>Post ID: {data.id}</p>
          <p>Title: {data.title}</p>
          <p>Body: {data.body}</p>
        </div>
      )}

      {/* Input fields */}
      <div>
        <label>Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <div>
        <label>Body:</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
        />
      </div>

      {/* Create post button */}
      <button onClick={trigger} disabled={isLoading}>
        Create Post
      </button>
    </div>
  );
}
```

### usePatch

The `usePatch` hook allows you to perform PATCH requests, similar to `usePost` and other idempotent hooks. It provides similar functionality for sending data to a remote API endpoint and managing the response.

#### Parameters

| Parameter    | Type     | Description                                     | Default |
| ------------ | -------- | ----------------------------------------------- | ------- |
| `url`        | `string` | The URL to send the PATCH request to.           | -       |
| `body`       | `any`    | The data to send in the request body.           | -       |
| `parameters` | `object` | Query parameters to include in the request URL. | `{}`    |
| `options`    | `object` | Additional [options](#options) for the request.             | `{}`    |

#### Output

The `usePatch` hook returns an object with properties similar to other hooks:

| Property     | Type                   | Description                                                                        |
| ------------ | ---------------------- | ---------------------------------------------------------------------------------- |
| `data`       | `T \| null`            | The response data or `null` if no data has been received yet.                      |
| `isLoading`  | `boolean`              | A boolean indicating whether the request is currently loading.                     |
| `error`      | `RequestError \| null` | An error object if the request encounters an error, otherwise `null`.              |
| `statusCode` | `number \| null`       | The HTTP status code of the response, or `null` if no response has been received.  |
| `sendData`   | `function`             | A function that can be called to manually trigger the PATCH request with new data. |

### usePut

The `usePut` hook allows you to perform PUT requests, similar to `usePost` and other idempotent hooks. It provides similar functionality for sending data to a remote API endpoint and managing the response.

#### Parameters

| Parameter    | Type     | Description                                     | Default |
| ------------ | -------- | ----------------------------------------------- | ------- |
| `url`        | `string` | The URL to send the PUT request to.             | -       |
| `body`       | `any`    | The data to send in the request body.           | -       |
| `parameters` | `object` | Query parameters to include in the request URL. | `{}`    |
| `options`    | `object` | Additional [options](#options) for the request.             | `{}`    |

#### Output

The `usePut` hook returns an object with properties similar to other hooks:

| Property     | Type                   | Description                                                                       |
| ------------ | ---------------------- | --------------------------------------------------------------------------------- |
| `data`       | `T \| null`            | The response data or `null` if no data has been received yet.                     |
| `isLoading`  | `boolean`              | A boolean indicating whether the request is currently loading.                    |
| `error`      | `RequestError \| null` | An error object if the request encounters an error, otherwise `null`.             |
| `statusCode` | `number \| null`       | The HTTP status code of the response, or `null` if no response has been received. |
| `sendData`   | `function`             | A function that can be called to manually trigger the PUT request with new data.  |

### useDelete

The `useDelete` hook allows you to perform DELETE requests, similar to other idempotent hooks. It provides similar functionality for sending data to a remote API endpoint and managing the response.

#### Parameters

| Parameter    | Type     | Description                                     | Default |
| ------------ | -------- | ----------------------------------------------- | ------- |
| `url`        | `string` | The URL to send the DELETE request to.          | -       |
| `parameters` | `object` | Query parameters to include in the request URL. | `{}`    |
| `options`    | `object` | Additional [options](#options) for the request.             | `{}`    |

#### Output

The `useDelete` hook returns an object with properties similar to other hooks:

| Property     | Type                   | Description                                                                       |
| ------------ | ---------------------- | --------------------------------------------------------------------------------- |
| `data`       | `T \| null`            | The response data or `null` if no data has been received yet.                     |
| `isLoading`  | `boolean`              | A boolean indicating whether the request is currently loading.                    |
| `error`      | `RequestError \| null` | An error object if the request encounters an error, otherwise `null`.             |
| `statusCode` | `number \| null`       | The HTTP status code of the response, or `null` if no response has been received. |
| `sendData`   | `function`             | A function that can be called to manually trigger the DELETE request.             |

## Options

Each hook accepts a set of optional `options` object to customize the behavior of the request. These options include:

| Option           | Type     | Description                                      |
| ---------------- | -------- | ------------------------------------------------ |
| `headers`        | `object` | Headers to include in the request.               |
| `mode`           | `string` | The request mode (e.g., "cors", "no-cors").      |
| `credentials`    | `string` | The request credentials (e.g., "same-origin").   |
| `cache`          | `string` | The caching strategy for the request.            |
| `redirect`       | `string` | The redirect mode (e.g., "follow", "error").     |
| `referrer`       | `string` | The referrer of the request.                     |
| `referrerPolicy` | `string` | The referrer policy for the request.             |
| `integrity`      | `string` | The subresource integrity value for the request. |

These options allow you to customize headers, mode, credentials, caching, and more. Refer to the documentation for the `fetch` function in the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) for more details.


<!-- ## Examples

Examples of how to use each hook can be found in the [examples](./examples) directory of this repository. -->

## Contributing

Contributions to `swirl-react` are welcome! Feel free to submit issues and pull requests on the [GitHub repository](https://github.com/pablonajera/swirl-react).

## License

This project is licensed under the [MIT License](./LICENSE). Feel free to use and distribute as you see fit.
