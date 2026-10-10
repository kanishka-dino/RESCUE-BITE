import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Code2, Database, Shield, Server, Copy, Check } from 'lucide-react';

interface SpringBootModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpringBootModal: React.FC<SpringBootModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'endpoints' | 'schema' | 'config'>('endpoints');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const springEndpointsCode = `// Spring Boot 3.x REST Controller Example
@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "\${app.cors.allowed-origins}")
public class FoodDonationController {

    private final FoodDonationService donationService;
    private final NotificationService notificationService;

    public FoodDonationController(FoodDonationService donationService, NotificationService notificationService) {
        this.donationService = donationService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<Page<DonationResponseDTO>> getDonations(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(donationService.findAvailableDonations(category, status, search, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<DonationResponseDTO> createDonation(
            @Valid @RequestBody CreateDonationRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(donationService.createDonation(request, userDetails.getUsername()));
    }

    @PostMapping("/{id}/claims")
    @PreAuthorize("hasRole('RECIPIENT')")
    public ResponseEntity<ClaimResponseDTO> claimDonation(
            @PathVariable Long id,
            @Valid @RequestBody ClaimDonationRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(donationService.claimDonation(id, request, userDetails.getUsername()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DonationResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam DonationStatus newStatus) {
        return ResponseEntity.ok(donationService.updateStatus(id, newStatus));
    }
}`;

  const mysqlSchemaCode = `-- MySQL 8.x Database Schema for RescueBite
CREATE DATABASE IF NOT EXISTS rescuebite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rescuebite_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    role ENUM('DONOR', 'RECIPIENT', 'ADMIN') NOT NULL,
    org_name VARCHAR(150) NOT NULL,
    org_type VARCHAR(80) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(80) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(60) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    donor_id BIGINT NOT NULL,
    storage_condition VARCHAR(80) NOT NULL,
    dietary_type VARCHAR(40) NOT NULL,
    allergens JSON,
    prep_timestamp DATETIME NOT NULL,
    expiry_deadline DATETIME NOT NULL,
    pickup_window_start DATETIME NOT NULL,
    pickup_window_end DATETIME NOT NULL,
    status ENUM('AVAILABLE', 'RESERVED', 'PICKUP_SCHEDULED', 'COLLECTED', 'COMPLETED', 'EXPIRED', 'CANCELLED') DEFAULT 'AVAILABLE',
    claimed_by_org_id BIGINT NULL,
    image_url VARCHAR(500),
    handling_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES users(id),
    CONSTRAINT fk_donation_recipient FOREIGN KEY (claimed_by_org_id) REFERENCES users(id)
);

CREATE TABLE claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donation_id BIGINT NOT NULL,
    recipient_org_id BIGINT NOT NULL,
    volunteer_name VARCHAR(100),
    volunteer_phone VARCHAR(30),
    beneficiaries_count INT DEFAULT 0,
    scheduled_pickup_time DATETIME NOT NULL,
    status ENUM('REQUESTED', 'CONFIRMED', 'COLLECTED', 'COMPLETED', 'CANCELLED') DEFAULT 'CONFIRMED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_claim_donation FOREIGN KEY (donation_id) REFERENCES donations(id),
    CONSTRAINT fk_claim_recipient FOREIGN KEY (recipient_org_id) REFERENCES users(id)
);`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Spring Boot & MySQL Architecture"
      subtitle="Production integration specifications for backend engineering"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        
        {/* Navigation tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'endpoints'
                ? 'bg-[#166534] text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>REST Endpoints</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-[#166534] text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-[#166534] text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Vite & Axios Integration</span>
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'endpoints' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Spring Boot 3.x / Java 21 REST Controller</span>
              <button
                onClick={() => copyToClipboard(springEndpointsCode)}
                className="flex items-center gap-1 text-[#166534] hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#12372A] text-emerald-100 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[360px]">
              {springEndpointsCode}
            </pre>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Relational MySQL 8.0 DDL Tables & Foreign Keys</span>
              <button
                onClick={() => copyToClipboard(mysqlSchemaCode)}
                className="flex items-center gap-1 text-[#166534] hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#12372A] text-emerald-100 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[360px]">
              {mysqlSchemaCode}
            </pre>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="p-4 bg-[#F5FAF4] rounded-xl border border-[#166534]/20 space-y-3 text-xs">
            <h4 className="font-bold text-[#12372A] text-sm">How to Connect Live Spring Boot API:</h4>
            <ol className="list-decimal pl-4 space-y-2 text-[#647067] leading-relaxed">
              <li>
                <strong>Set environment variable:</strong> Add <code className="bg-white px-1.5 py-0.5 rounded border font-mono">VITE_API_BASE_URL=http://localhost:8080/api</code> in your <code className="font-mono">.env</code>.
              </li>
              <li>
                <strong>Enable live requests:</strong> Set <code className="bg-white px-1.5 py-0.5 rounded border font-mono">VITE_USE_LIVE_API=true</code>. The services in <code className="font-mono">src/services/donationService.ts</code> will directly forward all requests via Axios.
              </li>
              <li>
                <strong>JWT Authorization:</strong> The configured Axios interceptor in <code className="font-mono">src/services/apiClient.ts</code> automatically transmits <code className="font-mono">Authorization: Bearer [token]</code> with every request.
              </li>
            </ol>
          </div>
        )}

        <div className="pt-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#166534] hover:bg-[#12372A] rounded-xl"
          >
            Close Architecture Reference
          </button>
        </div>

      </div>
    </Modal>
  );
};
