// Script để hash password - chạy trong IDE hoặc tạo class test
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Hash password "test123"
        String testPassword = encoder.encode("test123");
        System.out.println("Password 'test123' hashed: " + testPassword);
        
        // Hash password "admin123"  
        String adminPassword = encoder.encode("admin123");
        System.out.println("Password 'admin123' hashed: " + adminPassword);
        
        // Hash password "password123"
        String userPassword = encoder.encode("password123");
        System.out.println("Password 'password123' hashed: " + userPassword);
    }
}
