use axum::{
    routing::{get, post},
    Router,
    Json,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
    version: String,
}

#[derive(Serialize)]
struct ApiResponse<T: Serialize> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

#[derive(Serialize)]
struct ConsensusResult {
    query: String,
    answer: String,
    confidence: f32,
    supporting_papers: u32,
    contradicting_papers: u32,
    evidence_level: String,
    key_findings: Vec<String>,
}

#[derive(Deserialize)]
struct QueryRequest {
    query: String,
}

async fn health_check() -> impl IntoResponse {
    Json(HealthResponse {
        status: "healthy".to_string(),
        service: "Search scientific consensus".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn root() -> impl IntoResponse {
    Json(ApiResponse::<()> {
        success: true,
        data: None,
        error: None,
    })
}

async fn search_consensus(Json(req): Json<QueryRequest>) -> impl IntoResponse {
    let result = ConsensusResult {
        query: req.query.clone(),
        answer: "Based on analysis of multiple peer-reviewed studies, there is strong scientific consensus supporting this claim.".to_string(),
        confidence: 0.87,
        supporting_papers: 234,
        contradicting_papers: 12,
        evidence_level: "Strong".to_string(),
        key_findings: vec![
            "Multiple randomized controlled trials support this".to_string(),
            "Meta-analysis confirms statistical significance".to_string(),
            "Expert bodies endorse this position".to_string(),
        ],
    };

    Json(ApiResponse {
        success: true,
        data: Some(result),
        error: None,
    })
}

async fn get_topics() -> impl IntoResponse {
    let topics = vec![
        serde_json::json!({ "name": "Climate Change", "papers": 45678, "consensus": "97%" }),
        serde_json::json!({ "name": "Vaccines", "papers": 23456, "consensus": "99%" }),
        serde_json::json!({ "name": "Evolution", "papers": 34567, "consensus": "99%" }),
        serde_json::json!({ "name": "Nutrition", "papers": 56789, "consensus": "78%" }),
    ];

    Json(ApiResponse {
        success: true,
        data: Some(topics),
        error: None,
    })
}

async fn get_stats() -> impl IntoResponse {
    Json(ApiResponse {
        success: true,
        data: Some(serde_json::json!({
            "total_queries": 1234567,
            "papers_analyzed": 8901234,
            "topics_covered": 5678,
            "avg_confidence": 0.82
        })),
        error: None,
    })
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/search", post(search_consensus))
        .route("/api/topics", get(get_topics))
        .route("/api/stats", get(get_stats))
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await
        .unwrap();

    tracing::info!("Search scientific consensus backend running on port 3001");
    axum::serve(listener, app).await.unwrap();
}
