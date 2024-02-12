<?php
/**
 * API class.
 * 
 * @package Codeinwp/QuickWP
 */

namespace ThemeIsle\QuickWP;

/**
 * API class.
 */
class API {
	/**
	 * API namespace.
	 *
	 * @var string
	 */
	private $namespace = 'quickwp';

	/**
	 * API version.
	 *
	 * @var string
	 */
	private $version = 'v1';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_route();
	}

	/**
	 * Get endpoint.
	 * 
	 * @return string
	 */
	public function get_endpoint() {
		return $this->namespace . '/' . $this->version;
	}

	/**
	 * Register hooks and actions.
	 * 
	 * @return void
	 */
	private function register_route() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API route
	 * 
	 * @return void
	 */
	public function register_routes() {
		$namespace = $this->namespace . '/' . $this->version;

		$routes = array(
			'send'      => array(
				'methods'  => \WP_REST_Server::CREATABLE,
				'args'     => array(
					'step'     => array(
						'required' => true,
						'type'     => 'string',
					),
					'message'  => array(
						'required' => false,
						'type'     => 'string',
					),
					'template' => array(
						'required' => false,
						'type'     => 'string',
					),
				),
				'callback' => array( $this, 'send' ),
			),
			'status'    => array(
				'methods'  => \WP_REST_Server::READABLE,
				'args'     => array(
					'thread_id' => array(
						'required' => true,
						'type'     => 'string',
					),
					'run_id'    => array(
						'required' => true,
						'type'     => 'string',
					),
				),
				'callback' => array( $this, 'status' ),
			),
			'get'       => array(
				'methods'  => \WP_REST_Server::READABLE,
				'args'     => array(
					'thread_id' => array(
						'required' => true,
						'type'     => 'string',
					),
				),
				'callback' => array( $this, 'get' ),
			),
			'images'    => array(
				'methods'  => \WP_REST_Server::READABLE,
				'args'     => array(
					'query' => array(
						'required' => true,
						'type'     => 'string',
					),
				),
				'callback' => array( $this, 'images' ),
			),
			'templates' => array(
				'methods'  => \WP_REST_Server::READABLE,
				'args'     => array(
					'thread_id' => array(
						'required' => true,
						'type'     => 'string',
					),
					'images'    => array(
						'required' => false,
						'type'     => 'array',
					),
				),
				'callback' => array( $this, 'templates' ),
			),
			'homepage'  => array(
				'methods'  => \WP_REST_Server::READABLE,
				'args'     => array(
					'thread_id' => array(
						'required' => true,
						'type'     => 'string',
					),
					'template'  => array(
						'required' => true,
						'type'     => 'string',
					),
				),
				'callback' => array( $this, 'homepage' ),
			),
		);

		foreach ( $routes as $route => $args ) {
			$args['permission_callback'] = function () {
				return current_user_can( 'manage_options' );
			};

			register_rest_route( $namespace, '/' . $route, $args );
		}
	}

	/**
	 * Send data to the API.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function send( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$params = array(
			'step'    => $data['step'],
			'message' => $data['message'],
		);

		if ( isset( $data['template'] ) ) {
			$params['template'] = $data['template'];
		}

		$request = wp_remote_post(
			QUICKWP_APP_API . 'wizard/send',
			array(
				'timeout' => 20, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
				'body'    => $params,
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->id ) || ! $response->id ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		return new \WP_REST_Response( $response, 200 );
	}

	/**
	 * Get status.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function status( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$api_url = QUICKWP_APP_API . 'wizard/status';

		$query_params = array(
			'thread_id' => $data['thread_id'],
			'run_id'    => $data['run_id'],
		);

		$request_url = add_query_arg( $query_params, $api_url );

		$request = wp_safe_remote_get(
			$request_url,
			array(
				'timeout' => 20, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->id ) || ! $response->id ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		return new \WP_REST_Response( $response, 200 );
	}

	/**
	 * Get data.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function get( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$api_url = QUICKWP_APP_API . 'wizard/get';

		$query_params = array(
			'thread_id' => $data['thread_id'],
		);

		$request_url = add_query_arg( $query_params, $api_url );

		$request = wp_safe_remote_get(
			$request_url,
			array(
				'timeout' => 20, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->data ) || ! $response->data ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		return new \WP_REST_Response( $response, 200 );
	}

	/**
	 * Get homepage.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function homepage( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$api_url = QUICKWP_APP_API . 'wizard/get';

		$query_params = array(
			'thread_id' => $data['thread_id'],
		);

		$request_url = add_query_arg( $query_params, $api_url );

		$request = wp_safe_remote_get(
			$request_url,
			array(
				'timeout' => 20, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->data ) || ! $response->data ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		$items = self::process_json_from_response( $response->data );

		if ( ! $items ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error Parsing JSON', 'quickwp' ) ), 500 );
		}

		self::extract_data( $items );

		$templates = apply_filters( 'quickwp_templates', array() );

		if ( empty( $templates ) || ! isset( $templates['homepage'] ) ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		$template = $templates['homepage'][ $data['template'] ];

		$result = array();

		$theme_path = get_stylesheet_directory();

		$patterns = file_get_contents( $template ); //phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown

		if ( ! $patterns ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		preg_match_all( '/"slug":"(.*?)"/', $patterns, $matches );
		$slugs = $matches[1];

		$filtered_patterns = array();

		foreach ( $slugs as $slug ) {   
			$slug         = str_replace( 'quickwp/', '', $slug );
			$pattern_path = $theme_path . '/patterns/' . $slug . '.php';

			if ( ! file_exists( $pattern_path ) ) {
				continue;
			}

			ob_start();
			include $pattern_path;
			$pattern_content = ob_get_clean();
		
			$filtered_patterns[] = $pattern_content;
		}

		return new \WP_REST_Response(
			array(
				'status' => 'success',
				'data'   => implode( '', $filtered_patterns ),
			),
			200 
		);
	}

	/**
	 * Get templates.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function templates( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$api_url = QUICKWP_APP_API . 'wizard/get';

		$query_params = array(
			'thread_id' => $data['thread_id'],
		);

		$request_url = add_query_arg( $query_params, $api_url );

		$request = wp_safe_remote_get(
			$request_url,
			array(
				'timeout' => 20, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->data ) || ! $response->data ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		$items = self::process_json_from_response( $response->data );

		if ( ! $items ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error Parsing JSON', 'quickwp' ) ), 500 );
		}

		self::extract_data( $items );

		$templates = apply_filters( 'quickwp_templates', array() );

		if ( empty( $templates ) || ! isset( $templates['homepage'] ) ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		$items = $templates['homepage'];

		$result = array();

		$theme_path = get_stylesheet_directory();

		foreach ( $items as $item => $path ) {
			$pattern = file_get_contents( $path ); //phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown

			if ( ! $pattern ) {
				continue;
			}

			preg_match_all( '/"slug":"(.*?)"/', $pattern, $matches );
			$slugs = $matches[1];

			$filtered_patterns = array();

			foreach ( $slugs as $slug ) {   
				$slug         = str_replace( 'quickwp/', '', $slug );
				$pattern_path = $theme_path . '/patterns/' . $slug . '.php';

				if ( ! file_exists( $pattern_path ) ) {
					continue;
				}

				// Check if $data param has images and it counts more than 0.
				if ( isset( $data['images'] ) && count( $data['images'] ) > 0 ) {
					$images = $data['images'];

					add_filter(
						'quickwp/image',
						function () use( $images ) {
							// Get a random image from the array.
							$image = $images[ array_rand( $images ) ];
							return esc_url( $image['src'] );
						} 
					);
				}

				ob_start();
				include $pattern_path;
				$pattern_content = ob_get_clean();
			
				$filtered_patterns[] = $pattern_content;
			}

			$result[] = array(
				'slug'     => $item,
				'patterns' => implode( '', $filtered_patterns ),
			);
		}

		return new \WP_REST_Response(
			array(
				'status' => 'success',
				'data'   => $result,
			),
			200 
		);
	}

	/**
	 * Get images.
	 * 
	 * @param \WP_REST_Request $request Request.
	 * 
	 * @return \WP_REST_Response
	 */
	public function images( \WP_REST_Request $request ) {
		$data = $request->get_params();

		$api_url = QUICKWP_APP_API . 'wizard/images';

		$query_params = array(
			'query' => $data['query'],
		);

		$request_url = add_query_arg( $query_params, $api_url );

		$request = wp_safe_remote_get(
			$request_url,
			array(
				'timeout' => 20, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
			)
		);

		if ( is_wp_error( $request ) ) {
			return new \WP_REST_Response( array( 'error' => $request->get_error_message() ), 500 );
		}

		/** 
		 * Holds the response as a standard class object
		 *
		 * @var \stdClass $response 
		 */
		$response = json_decode( wp_remote_retrieve_body( $request ) );

		if ( ! isset( $response->photos ) ) {
			return new \WP_REST_Response( array( 'error' => __( 'Error', 'quickwp' ) ), 500 );
		}

		return new \WP_REST_Response( $response, 200 );
	}

	/**
	 * Get JSON from response.
	 *
	 * @param array<object> $data Response.
	 * 
	 * @throws \Exception Exception in case of invalid JSON.
	 * 
	 * @return array<object>|false
	 */
	private static function process_json_from_response( $data ) {
		// Find the target item.
		$target = current( $data );

		if ( false === $target || ! isset( $target->content ) ) {
			return false;
		}
	
		// Extract the JSON string.
		$json_string = $target->content[0]->text->value;

		try {
			$json_object = json_decode( $json_string, true );

			if ( is_array( $json_object ) ) {
				return $json_object;
			}

			throw new \Exception( 'Invalid JSON' );
		} catch ( \Exception $e ) {
			if ( substr( $json_string, 0, 7 ) === '```json' && substr( trim( $json_string ), -3 ) === '```' ) {
				$cleaned_json = trim( str_replace( array( '```json', '```' ), '', $json_string ) );
				$json_object  = json_decode( $cleaned_json, true );

				if ( is_array( $json_object ) ) {
					return $json_object;
				}
			}
		}

		return false;
	}

	/**
	 * Extract Data.
	 * 
	 * @param array<object> $items Items.
	 * 
	 * @return void
	 */
	private static function extract_data( $items ) {
		foreach ( $items as $item ) {
			if ( ! isset( $item['slug'] ) || ! isset( $item['order'] ) || ! isset( $item['strings'] ) ) {
				continue;
			}

			$strings = $item['strings'];

			foreach ( $strings as $string ) {
				add_filter(
					'quickwp/' . $string['slug'],
					function () use( $string ) {
						return esc_html( $string['value'] );
					} 
				);
			}

			if ( isset( $item['images'] ) ) {
				$images = $item['images'];

				foreach ( $images as $image ) {
					add_filter(
						'quickwp/' . $image['slug'],
						function ( $value ) use( $image ) {
							if ( filter_var( $image['src'], FILTER_VALIDATE_URL ) && ( strpos( $image['src'], 'pexels.com' ) !== false ) ) {
								return esc_url( $image['src'] );
							}

							return $value;
						} 
					);
				}
			}
		}
	}
}
