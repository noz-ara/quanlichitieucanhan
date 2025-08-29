package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class FileMetadata extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long file_id;

    private String fileName;
    private long fileSize;

    @Lob
    @Column(columnDefinition = "BLOB", length = 1048576) // Specify the length in bytes
    private byte[] fileContent; // Store the file content as a byte array in the database
}
