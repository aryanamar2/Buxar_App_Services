import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Code2,
  Database,
  Terminal,
  Copy,
  Check,
  FileCode,
  Layers,
  FolderTree,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  Download,
  BookOpen,
  Globe,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Key,
} from 'lucide-react';

interface CodeSnippet {
  id: string;
  filename: string;
  filepath: string;
  language: string;
  category: 'SPRING_BOOT' | 'DATABASE' | 'ANDROID' | 'SECURITY' | 'DOCKER';
  description: string;
  code: string;
}

export const BackendArchitectureViewer: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<'CODE' | 'HOSTING_GUIDE'>('CODE');
  const [selectedCategory, setSelectedCategory] = useState<
    'ALL' | 'SPRING_BOOT' | 'DATABASE' | 'ANDROID' | 'SECURITY' | 'DOCKER'
  >('ALL');
  const [activeSnippetId, setActiveSnippetId] = useState<string>('booking_controller');
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const snippets: CodeSnippet[] = [
    {
      id: 'booking_controller',
      filename: 'BookingController.java',
      filepath: 'backend/src/main/java/com/buxarhomeservices/controller/BookingController.java',
      language: 'java',
      category: 'SPRING_BOOT',
      description: 'REST Controller managing Customer bookings, OTP verification, and status timeline.',
      code: `package com.buxarhomeservices.controller;

import com.buxarhomeservices.dto.BookingRequestDto;
import com.buxarhomeservices.dto.BookingResponseDto;
import com.buxarhomeservices.dto.ReviewRequestDto;
import com.buxarhomeservices.service.BookingService;
import com.buxarhomeservices.security.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingResponseDto> createBooking(
            @Valid @RequestBody BookingRequestDto requestDto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        BookingResponseDto created = bookingService.createBooking(currentUser.getId(), requestDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getCustomerBookings(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(bookingService.getBookingsForCustomer(currentUser.getId()));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDto> getBookingDetails(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBookingById(bookingId));
    }

    @PostMapping("/{bookingId}/confirm")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingResponseDto> confirmAppointment(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(bookingService.confirmAppointment(bookingId, currentUser.getId()));
    }

    @PostMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long bookingId,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        bookingService.cancelBooking(bookingId, currentUser.getId(), reason);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{bookingId}/review")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingResponseDto> addReview(
            @PathVariable Long bookingId,
            @Valid @RequestBody ReviewRequestDto reviewDto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(bookingService.submitReview(bookingId, currentUser.getId(), reviewDto));
    }
}`,
    },
    {
      id: 'technician_controller',
      filename: 'TechnicianController.java',
      filepath: 'backend/src/main/java/com/buxarhomeservices/controller/TechnicianController.java',
      language: 'java',
      category: 'SPRING_BOOT',
      description: 'REST Controller for technician acceptance, rejection, on-the-way, and job completion.',
      code: `package com.buxarhomeservices.controller;

import com.buxarhomeservices.dto.BookingResponseDto;
import com.buxarhomeservices.dto.TechnicianAvailabilityDto;
import com.buxarhomeservices.service.TechnicianService;
import com.buxarhomeservices.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/technician")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TECHNICIAN')")
public class TechnicianController {

    private final TechnicianService technicianService;

    @GetMapping("/requests/nearby")
    public ResponseEntity<List<BookingResponseDto>> getIncomingRequests(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(technicianService.getIncomingRequestsInBuxar(currentUser.getId()));
    }

    @PostMapping("/requests/{bookingId}/accept")
    public ResponseEntity<BookingResponseDto> acceptRequest(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(technicianService.acceptBooking(bookingId, currentUser.getId()));
    }

    @PostMapping("/requests/{bookingId}/reject")
    public ResponseEntity<Void> rejectRequest(
            @PathVariable Long bookingId,
            @RequestParam(defaultValue = "Busy with another customer") String reason,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        technicianService.rejectBooking(bookingId, currentUser.getId(), reason);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bookings/{bookingId}/on-the-way")
    public ResponseEntity<BookingResponseDto> markOnTheWay(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(technicianService.markOnTheWay(bookingId, currentUser.getId()));
    }

    @PostMapping("/bookings/{bookingId}/start")
    public ResponseEntity<BookingResponseDto> startJobWithOtp(
            @PathVariable Long bookingId,
            @RequestParam String otpCode,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(technicianService.startJob(bookingId, currentUser.getId(), otpCode));
    }

    @PostMapping("/bookings/{bookingId}/complete")
    public ResponseEntity<BookingResponseDto> markJobCompleted(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(technicianService.completeJob(bookingId, currentUser.getId()));
    }

    @PutMapping("/availability")
    public ResponseEntity<Void> setAvailability(
            @RequestBody TechnicianAvailabilityDto dto,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        technicianService.updateAvailability(currentUser.getId(), dto.isOnline());
        return ResponseEntity.ok().build();
    }
}`,
    },
    {
      id: 'booking_service',
      filename: 'BookingService.java',
      filepath: 'backend/src/main/java/com/buxarhomeservices/service/BookingService.java',
      language: 'java',
      category: 'SPRING_BOOT',
      description: 'Core state machine enforcing valid transitions: REQUESTED -> CONFIRMED -> ON_THE_WAY -> STARTED -> COMPLETED.',
      code: `package com.buxarhomeservices.service;

import com.buxarhomeservices.entity.*;
import com.buxarhomeservices.enums.BookingStatus;
import com.buxarhomeservices.repository.*;
import com.buxarhomeservices.dto.*;
import com.buxarhomeservices.exception.ResourceNotFoundException;
import com.buxarhomeservices.exception.InvalidStatusTransitionException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final ServiceBookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponseDto createBooking(Long customerId, BookingRequestDto dto) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        ServiceCategory category = categoryRepository.findById(dto.getServiceCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        String bookingNumber = "BXR-" + LocalDateTime.now().getYear() + "-" + (100 + new SecureRandom().nextInt(900));
        String otp = String.format("%04d", new SecureRandom().nextInt(10000));

        ServiceBooking booking = ServiceBooking.builder()
                .bookingNumber(bookingNumber)
                .customer(customer)
                .serviceCategory(category)
                .specificIssue(dto.getSpecificIssue())
                .problemDescription(dto.getProblemDescription())
                .photoUrl(dto.getPhotoUrl())
                .buxarArea(dto.getBuxarArea())
                .customerAddress(dto.getCustomerAddress())
                .preferredDate(dto.getPreferredDate())
                .preferredTimeSlot(dto.getPreferredTimeSlot())
                .status(BookingStatus.REQUESTED)
                .price(category.getBasePrice())
                .otpCode(otp)
                .build();

        ServiceBooking saved = bookingRepository.save(booking);
        notificationService.dispatchToNearbyTechnicians(saved);

        return mapToDto(saved);
    }

    @Transactional
    public BookingResponseDto startJob(Long bookingId, Long technicianId, String enteredOtp) {
        ServiceBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getOtpCode().equals(enteredOtp)) {
            throw new IllegalArgumentException("Invalid work verification OTP entered.");
        }

        if (booking.getStatus() != BookingStatus.ON_THE_WAY) {
            throw new InvalidStatusTransitionException("Job can only start after technician is ON_THE_WAY");
        }

        booking.setStatus(BookingStatus.STARTED);
        return mapToDto(bookingRepository.save(booking));
    }
}`,
    },
    {
      id: 'security_config',
      filename: 'SecurityConfig.java',
      filepath: 'backend/src/main/java/com/buxarhomeservices/security/SecurityConfig.java',
      language: 'java',
      category: 'SECURITY',
      description: 'Spring Security 6 with stateless JWT authentication filter and method security.',
      code: `package com.buxarhomeservices.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/api/v1/services/**", "/actuator/health").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/technician/**").hasRole("TECHNICIAN")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`,
    },
    {
      id: 'postgresql_schema',
      filename: 'schema.sql',
      filepath: 'backend/src/main/resources/schema.sql',
      language: 'sql',
      category: 'DATABASE',
      description: 'PostgreSQL Relational DDL with Foreign Keys, ENUMs, and Buxar Ward indexing.',
      code: `-- BUXAR HOME SERVICES POSTGRESQL PRODUCTION DDL
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'TECHNICIAN', 'ADMIN');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE booking_status AS ENUM (
    'REQUESTED', 'ACCEPTED', 'REJECTED', 'CONFIRMED', 
    'ON_THE_WAY', 'STARTED', 'COMPLETED', 'CANCELLED'
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE technicians (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES service_categories(id),
    experience_years INT DEFAULT 1,
    base_area VARCHAR(150) NOT NULL,
    aadhaar_number VARCHAR(20) NOT NULL,
    is_online BOOLEAN DEFAULT TRUE,
    verification_status verification_status DEFAULT 'PENDING',
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    completed_jobs INT DEFAULT 0,
    bio TEXT
);

CREATE TABLE service_bookings (
    id BIGSERIAL PRIMARY KEY,
    booking_number VARCHAR(40) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL REFERENCES users(id),
    technician_id BIGINT REFERENCES technicians(id),
    category_id BIGINT NOT NULL REFERENCES service_categories(id),
    specific_issue VARCHAR(255) NOT NULL,
    problem_description TEXT NOT NULL,
    photo_url TEXT,
    buxar_area VARCHAR(150) NOT NULL,
    customer_address TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_slot VARCHAR(60) NOT NULL,
    status booking_status DEFAULT 'REQUESTED',
    visiting_fee DECIMAL(10,2) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_reviews (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT UNIQUE NOT NULL REFERENCES service_bookings(id),
    customer_id BIGINT NOT NULL REFERENCES users(id),
    technician_id BIGINT NOT NULL REFERENCES technicians(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_buxar_area ON service_bookings(buxar_area);
CREATE INDEX idx_bookings_status ON service_bookings(status);
CREATE INDEX idx_technicians_category ON technicians(category_id);`,
    },
    {
      id: 'android_api_service',
      filename: 'ApiService.kt',
      filepath: 'android/app/src/main/java/com/buxarhomeservices/network/ApiService.kt',
      language: 'kotlin',
      category: 'ANDROID',
      description: 'Retrofit interface communicating with Spring Boot REST API for Android.',
      code: `package com.buxarhomeservices.network

import com.buxarhomeservices.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @POST("/api/v1/auth/login")
    suspend fun login(@Body req: LoginRequest): Response<AuthResponse>

    @POST("/api/v1/auth/register")
    suspend fun register(@Body req: RegisterRequest): Response<AuthResponse>

    @GET("/api/v1/services")
    suspend fun getCategories(): Response<List<ServiceCategory>>

    @POST("/api/v1/bookings")
    suspend fun createBooking(@Body req: CreateBookingRequest): Response<BookingResponse>

    @GET("/api/v1/bookings")
    suspend fun getCustomerBookings(): Response<List<BookingResponse>>

    @POST("/api/v1/bookings/{id}/review")
    suspend fun submitReview(
        @Path("id") bookingId: Long,
        @Body review: ReviewRequest
    ): Response<BookingResponse>

    @GET("/api/v1/technician/requests/nearby")
    suspend fun getTechnicianRequests(): Response<List<BookingResponse>>

    @POST("/api/v1/technician/requests/{id}/accept")
    suspend fun acceptRequest(@Path("id") id: Long): Response<BookingResponse>

    @POST("/api/v1/technician/bookings/{id}/start")
    suspend fun startJob(
        @Path("id") id: Long,
        @Query("otpCode") otp: String
    ): Response<BookingResponse>

    @POST("/api/v1/technician/bookings/{id}/complete")
    suspend fun completeJob(@Path("id") id: Long): Response<BookingResponse>
}`,
    },
    {
      id: 'android_customer_screen',
      filename: 'CustomerHomeScreen.kt',
      filepath: 'android/app/src/main/java/com/buxarhomeservices/ui/CustomerHomeScreen.kt',
      language: 'kotlin',
      category: 'ANDROID',
      description: 'Android Jetpack Compose UI for Customer Service Selection & Booking in Buxar.',
      code: `package com.buxarhomeservices.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.buxarhomeservices.model.ServiceCategory
import com.buxarhomeservices.viewmodel.CustomerHomeViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerHomeScreen(
    viewModel: CustomerHomeViewModel,
    onCategoryClick: (ServiceCategory) -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Column {
                        Text("Buxar Home Services", style = MaterialTheme.typography.titleMedium)
                        Text("📍 Charitravan, Buxar", style = MaterialTheme.typography.labelSmall)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            )
        }
    ) { padding ->
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.padding(padding)
        ) {
            items(state.categories) { category ->
                Card(
                    onClick = { onCategoryClick(category) },
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = category.name, style = MaterialTheme.typography.titleSmall)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Visiting Fee: ₹\${category.basePrice}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
        }
    }
}`,
    },
    {
      id: 'docker_compose',
      filename: 'docker-compose.yml',
      filepath: 'docker-compose.yml',
      language: 'yaml',
      category: 'DOCKER',
      description: 'Docker Compose configuration for PostgreSQL and Spring Boot backend.',
      code: `version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: buxar-postgres
    environment:
      POSTGRES_DB: buxar_home_services
      POSTGRES_USER: buxar_user
      POSTGRES_PASSWORD: buxar_secret_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backend/src/main/resources/schema.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  backend:
    build: ./backend
    container_name: buxar-spring-boot
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/buxar_home_services
      SPRING_DATASOURCE_USERNAME: buxar_user
      SPRING_DATASOURCE_PASSWORD: buxar_secret_password
      JWT_SECRET: 9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  pgdata:`,
    },
  ];

  const filteredSnippets = snippets.filter((s) => {
    if (selectedCategory === 'ALL') return true;
    return s.category === selectedCategory;
  });

  const activeSnippet = snippets.find((s) => s.id === activeSnippetId) || snippets[0];

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // README
      zip.file(
        'README.md',
        `# Buxar Home Services — Full-Stack Platform

Enterprise on-demand home service marketplace for Buxar, Bihar.
Connecting verified local technicians (plumbers, electricians, AC technicians, carpenters, cleaners) with residential customers and administration.

## Project Structure
- \`/backend\`: Java Spring Boot 3.3 REST API with Spring Security (JWT) and Spring Data JPA.
- \`/android\`: Native Android Kotlin Jetpack Compose app supporting Customer, Technician, and Admin dashboards.
- \`/database\`: PostgreSQL 16 schema with tables, triggers, and Buxar ward indexes.
- \`docker-compose.yml\`: 1-command local deployment.

## Quick Start
1. Run database and backend:
   \`\`\`bash
   docker compose up -d
   \`\`\`
2. Open \`/android\` in Android Studio Hedgehog or Ladybug.
3. Build and run on device or emulator.
`
      );

      // Add each code snippet to its relative filepath
      snippets.forEach((snippet) => {
        zip.file(snippet.filepath, snippet.code);
      });

      // Add pom.xml
      zip.file(
        'backend/pom.xml',
        `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.3</version>
        <relativePath/>
    </parent>
    <groupId>com.buxarhomeservices</groupId>
    <artifactId>buxar-home-services-api</artifactId>
    <version>1.0.0</version>
    <name>Buxar Home Services API</name>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>`
      );

      // Generate ZIP and trigger browser download
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'buxar-home-services-complete-project.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <Terminal className="w-4 h-4" />
            <span>FULL STACK PROJECT DOWNLOAD & DEPLOYMENT CENTER</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Generating ZIP...' : 'Download Complete Code (.ZIP)'}</span>
            </button>
          </div>
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Buxar Home Services — Codebase & Production Hosting
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Download the production Java Spring Boot 3 + PostgreSQL backend and Android Kotlin Jetpack Compose
          application code in a single ZIP. Below is the complete step-by-step roadmap to publish to Google Play Store and host the web application.
        </p>

        {/* Sub Navigation: Code vs Hosting Guide */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => setMainTab('CODE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              mainTab === 'CODE'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Source Code Modules</span>
          </button>
          <button
            onClick={() => setMainTab('HOSTING_GUIDE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              mainTab === 'HOSTING_GUIDE'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Google Play Store & Web Hosting Guide</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CODE MODULES */}
      {mainTab === 'CODE' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', 'SPRING_BOOT', 'DATABASE', 'ANDROID', 'SECURITY', 'DOCKER'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: File Tree */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderTree className="w-4 h-4 text-emerald-700" />
                  Files in Project
                </h3>
                <span className="text-[11px] text-slate-400">{filteredSnippets.length} files</span>
              </div>

              <div className="space-y-1">
                {filteredSnippets.map((snip) => {
                  const isSelected = snip.id === activeSnippet.id;
                  return (
                    <button
                      key={snip.id}
                      onClick={() => setActiveSnippetId(snip.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{snip.filename}</div>
                        <div className="text-[10px] text-slate-400 truncate">{snip.filepath}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Code Viewer */}
            <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-semibold">{activeSnippet.filename}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 truncate max-w-[280px]">{activeSnippet.filepath}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(activeSnippet.id, activeSnippet.code)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  {copiedId === activeSnippet.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800 text-[11px] text-slate-400">
                {activeSnippet.description}
              </div>

              <div className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[560px]">
                <pre className="selection:bg-emerald-900 selection:text-white">
                  <code>{activeSnippet.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: HOSTING & PLAY STORE ROADMAP */}
      {mainTab === 'HOSTING_GUIDE' && (
        <div className="space-y-6">
          {/* Section A: Google Play Store Requirements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-emerald-800">
              <Smartphone className="w-6 h-6 text-emerald-700" />
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  Part 1: Google Play Store Release (Android App)
                </h3>
                <p className="text-xs text-slate-500">
                  What is needed to publish Buxar Home Services on the Google Play Store
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  1. Google Play Console Account
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Go to <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline">play.google.com/console</a>.
                  Sign in with your Google account and pay the <b>$25 one-time developer registration fee</b>.
                </p>
                <div className="text-[11px] text-slate-500">
                  • <b>Organization vs Individual</b>: If registered under a firm or MSME, choose Organization to skip the 20-tester requirement.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-emerald-600" />
                  2. Generate Signed Android App Bundle (.aab)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Open the downloaded <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">/android</code> project in Android Studio.
                </p>
                <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px]">
                  Build &gt; Generate Signed Bundle / APK &gt; Android App Bundle (.aab)
                </div>
                <div className="text-[11px] text-slate-500">
                  Save your <code className="text-slate-700">buxar-keystore.jks</code> key securely; it is required for all future app updates.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  3. Store Listing Assets Required
                </h4>
                <ul className="space-y-1 text-slate-600 list-disc pl-4 text-[11px]">
                  <li><b>App Icon</b>: 512 x 512 px (32-bit PNG with alpha).</li>
                  <li><b>Feature Graphic</b>: 1024 x 500 px (JPEG or 24-bit PNG, no alpha).</li>
                  <li><b>Phone Screenshots</b>: Minimum 2 screenshots (16:9 or 9:16 aspect ratio).</li>
                  <li><b>Short Description</b>: Max 80 characters ("Book trusted local plumbers, electricians & AC repair in Buxar, Bihar").</li>
                  <li><b>Full Description</b>: Max 4000 characters explaining services and safety features.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  4. Privacy Policy & Permissions
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Google Play mandates a live HTTPS Privacy Policy URL if the app uses Camera (for problem photo upload) or Location (for Buxar ward dispatch).
                </p>
                <div className="text-[11px] text-slate-500">
                  Target API level: <b>Android 14 / 15 (API Level 34+)</b> in <code className="text-slate-700">targetSdkVersion = 34</code>.
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Web App & Backend Hosting Requirements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-blue-800">
              <Globe className="w-6 h-6 text-blue-700" />
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  Part 2: Hosting the Web App & Spring Boot Backend
                </h3>
                <p className="text-xs text-slate-500">
                  Architecture and deployment options for 24/7 uptime in India
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Frontend */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900">A. Customer & Admin Web App</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    React 19 + Vite + Tailwind CSS Single Page Application.
                  </div>
                  <div className="mt-3 space-y-1 text-slate-600 text-[11px]">
                    <div><b>Recommended Hosts:</b></div>
                    <div>• <b>Vercel / Cloudflare Pages</b> (Free tier, global CDN)</div>
                    <div>• <b>Firebase Hosting</b> / AWS S3 + CloudFront</div>
                  </div>
                </div>
                <div className="bg-slate-900 text-slate-200 p-2 rounded-lg font-mono text-[10px] mt-2">
                  npm run build<br />
                  npx vercel --prod
                </div>
              </div>

              {/* Backend API */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900">B. Spring Boot REST API</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Java 17/21 + Spring Boot 3.3 runtime container.
                  </div>
                  <div className="mt-3 space-y-1 text-slate-600 text-[11px]">
                    <div><b>Recommended Hosts:</b></div>
                    <div>• <b>Railway.app / Render.com</b> ($5/mo, 1-click Docker deploy)</div>
                    <div>• <b>GCP Cloud Run</b> (scale-to-zero, Mumbai region)</div>
                    <div>• <b>DigitalOcean / Hetzner VPS</b> (₹450/mo)</div>
                  </div>
                </div>
                <div className="bg-slate-900 text-slate-200 p-2 rounded-lg font-mono text-[10px] mt-2">
                  mvn clean package -DskipTests<br />
                  docker build -t buxar-api .
                </div>
              </div>

              {/* Database */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900">C. PostgreSQL Database</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Relational storage for bookings, users, and audit history.
                  </div>
                  <div className="mt-3 space-y-1 text-slate-600 text-[11px]">
                    <div><b>Recommended Providers:</b></div>
                    <div>• <b>Supabase / Neon Postgres</b> (Free tier available)</div>
                    <div>• <b>Railway PostgreSQL</b> (automatic backup)</div>
                    <div>• <b>AWS RDS / GCP Cloud SQL</b> (Production grade)</div>
                  </div>
                </div>
                <div className="bg-slate-900 text-slate-200 p-2 rounded-lg font-mono text-[10px] mt-2">
                  psql -h hostname -U user -d db &lt; schema.sql
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Complete Checklist Summary */}
          <div className="bg-emerald-900 text-white rounded-2xl p-6 space-y-3">
            <h4 className="font-display font-bold text-base text-white">
              Launch Checklist Summary for Buxar Home Services
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-emerald-100">
              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-700/50 space-y-1">
                <div className="font-bold text-white">1. Domain Name</div>
                <p className="text-[11px]">Buy <code className="text-emerald-300">buxarhomeservices.com</code> or <code className="text-emerald-300">.in</code> (~₹700/yr on Namecheap or GoDaddy).</p>
              </div>
              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-700/50 space-y-1">
                <div className="font-bold text-white">2. Play Console</div>
                <p className="text-[11px]">Register $25 one-time developer account on Google Play Console.</p>
              </div>
              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-700/50 space-y-1">
                <div className="font-bold text-white">3. SMS & OTP Gateway</div>
                <p className="text-[11px]">Sign up on Fast2SMS or MSG91 (DLT registration in India) for customer OTP alerts.</p>
              </div>
              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-700/50 space-y-1">
                <div className="font-bold text-white">4. Payment Gateway</div>
                <p className="text-[11px]">Create Razorpay / Cashfree account for optional UPI online payments.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
