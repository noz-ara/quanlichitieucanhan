package com.example.backend.exception;

import com.example.backend.model.ErrorResponse;
import org.hibernate.LazyInitializationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.csrf.InvalidCsrfTokenException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Handle CSRF Token mismatch
    @ExceptionHandler(InvalidCsrfTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCsrfTokenException(InvalidCsrfTokenException ex) {
        return buildError(HttpStatus.BAD_REQUEST, "Invalid CSRF Token", ex);
    }

    // Handle Access Denied (403)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        return buildError(HttpStatus.FORBIDDEN, "Access Denied: You do not have permission to access this resource", ex);
    }

    // Handle Unsupported Media Type
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException ex) {
        return buildError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported Media Type: " + ex.getContentType(), ex);
    }

    // Handle File Not Found
    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleFileNotFoundException(FileNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, "File Not Found: " + ex.getMessage(), ex);
    }

    // Handle IO exceptions
    @ExceptionHandler(IOException.class)
    public ResponseEntity<ErrorResponse> handleIOException(IOException ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error: I/O issue occurred", ex);
    }

    // Handle LazyInitializationException
    @ExceptionHandler(LazyInitializationException.class)
    public ResponseEntity<ErrorResponse> handleLazyInitializationException(LazyInitializationException ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Lazy initialization error: Entity not properly loaded. Check service layer.", ex);
    }

    // Handle Resource Not Found (custom)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), ex);
    }

    // Handle Invalid Input (custom)
    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<ErrorResponse> handleInvalidInputException(InvalidInputException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
    }

    // Catch-all for other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.", ex);
    }

    // Utility method
    private ResponseEntity<ErrorResponse> buildError(HttpStatus status, String message, Exception ex) {
        log.error("Exception handled: {}", ex.getMessage(), ex);
        ErrorResponse errorResponse = new ErrorResponse(
                status.value(),
                message,
                LocalDateTime.now().format(formatter)
        );
        return new ResponseEntity<>(errorResponse, status);
    }
}
